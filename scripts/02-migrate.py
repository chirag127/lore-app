"""
KnowledgeAtlas 32→11 Category Migration
========================================
Maps existing 32-category tree into new 11-category tree.
Preserves all book content. Updates meta.json.

Usage:
    python scripts/02-migrate.py --dry-run     # preview changes
    python scripts/02-migrate.py --execute     # apply changes
"""
import os, sys, json, shutil, re, subprocess
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parent.parent
KNOWLEDGE = ROOT / "knowledge"
ARCHIVE = ROOT / "knowledge-archive"
SOURCE = None  # set to ARCHIVE after archive step

# ─── OLD CATEGORY -> NEW CATEGORY MAPPING ────────────────────────────
OLD_TO_NEW_CAT = {
    "01-health-fitness-longevity":              "05-health-medicine-life-sciences",
    "02-medicine-health-sciences":              "05-health-medicine-life-sciences",
    "03-biology-life-sciences":                 "05-health-medicine-life-sciences",
    "04-self-help-personal-development":        "01-learning-productivity",
    "05-productivity-performance":              "01-learning-productivity",
    "06-productivity":                          "01-learning-productivity",
    "07-decision-making-systems-thinking":      "03-decision-making-systems-thinking",
    "08-psychology":                            "02-psychology-human-behavior",
    "09-philosophy":                            "04-philosophy-religion",
    "10-religion-spirituality":                 "04-philosophy-religion",
    "11-finance-investing":                     "06-finance-investing",
    "12-business-management-entrepreneurship":  "07-business-management-entrepreneurship",
    "13-economics-economic-theory":             "09-history-society-politics",
    "14-communication-language-linguistics":    "08-communication-language-writing",
    "15-education-pedagogy":                    "01-learning-productivity",
    "16-social-sciences-sociology":             "09-history-society-politics",
    "17-law-legal-systems":                     "09-history-society-politics",
    "18-history":                               "09-history-society-politics",
    "19-political-science-geopolitics":         "09-history-society-politics",
    "20-pure-sciences":                         "10-mathematics-science-technology",
    "21-nature-environment-ecology":            "10-mathematics-science-technology",
    "22-mathematics-statistics":                "10-mathematics-science-technology",
    "23-computer-science":                      "10-mathematics-science-technology",
    "24-software-engineering":                  "10-mathematics-science-technology",
    "25-artificial-intelligence-machine-learning": "10-mathematics-science-technology",
    "26-technology-engineering":                "10-mathematics-science-technology",
    "27-biography-memoir":                      "11-arts-media-biography-fiction",
    "28-fiction":                               "11-arts-media-biography-fiction",
    "29-poetry-drama-performing-arts":          "11-arts-media-biography-fiction",
    "30-music-film-media":                      "11-arts-media-biography-fiction",
    "31-architecture-art-design":               "11-arts-media-biography-fiction",
    "32-literary-criticism-theory":             "11-arts-media-biography-fiction",
}

# ─── NEW CATEGORY -> SUBCATEGORIES ────────────────────────────────────
# All new subcategory paths that will exist
NEW_SUBCATEGORIES = {
    "01-learning-productivity": [
        "01-learning-foundations", "02-habit-formation", "03-deep-work-focus",
        "04-note-taking-knowledge-management", "05-creativity-innovation",
        "06-personal-productivity-systems", "07-skill-acquisition-mastery",
    ],
    "02-psychology-human-behavior": [
        "01-cognitive-psychology", "02-behavioral-psychology",
        "03-social-psychology", "04-motivation-emotion",
        "05-personality-individual-differences", "06-developmental-psychology",
        "07-positive-psychology", "08-clinical-psychology-mental-health",
        "09-learning-theory",
    ],
    "03-decision-making-systems-thinking": [
        "01-mental-models", "02-probability-uncertainty",
        "03-forecasting-prediction", "04-risk-resilience",
        "05-systems-thinking", "06-cognitive-biases-debiasing",
        "07-rationality-judgment", "08-game-theory",
    ],
    "04-philosophy-religion": [
        "01-western-philosophy", "02-indian-philosophy", "03-eastern-philosophy",
        "04-ethics-moral-philosophy", "05-logic-critical-thinking",
        "06-religion-spirituality", "07-comparative-philosophy",
    ],
    "05-health-medicine-life-sciences": [
        "01-medicine-clinical-science", "02-neuroscience-brain-health",
        "03-nutrition-diet", "04-exercise-science-fitness",
        "05-sleep-science", "06-longevity-aging",
        "07-biology-life-sciences", "08-psychology-mental-health",
    ],
    "06-finance-investing": [
        "01-personal-finance-wealth-building", "02-value-investing",
        "03-index-investing-passive", "04-behavioral-finance",
        "05-advanced-contrarian-investing", "06-risk-management",
        "07-quantitative-finance", "08-financial-history",
        "09-venture-capital-private-equity", "10-real-estate-investing",
        "11-indian-finance", "12-fixed-income-derivatives",
        "13-alternative-investments",
    ],
    "07-business-management-entrepreneurship": [
        "01-entrepreneurship-startups", "02-business-strategy",
        "03-leadership-executive-development", "04-management-organizational-behavior",
        "05-marketing-brand-strategy", "06-operations-supply-chain",
        "07-product-management", "08-sales-business-development",
        "09-corporate-finance-accounting", "10-consulting-frameworks",
    ],
    "08-communication-language-writing": [
        "01-writing-craft", "02-nonfiction-writing", "03-storytelling",
        "04-persuasion-rhetoric", "05-public-speaking-presentation",
        "06-communication-theory", "07-linguistics", "08-language-learning",
    ],
    "09-history-society-politics": [
        "01-world-history-civilizations", "02-history-ideas-intellectual-history",
        "03-sociology", "04-anthropology", "05-political-science",
        "06-geopolitics-international-relations", "07-public-policy-governance",
        "08-biography-memoir-history", "09-cultural-studies",
        "10-law-legal-systems",
    ],
    "10-mathematics-science-technology": [
        "01-mathematics", "02-statistics-probability", "03-physics",
        "04-chemistry", "05-popular-science", "06-computer-science",
        "07-software-engineering", "08-system-design-scalability",
        "09-ai-machine-learning", "10-data-algorithms",
        "11-devops-sre-platform-engineering", "12-networking-distributed-systems",
        "13-cybersecurity", "14-engineering-general",
    ],
    "11-arts-media-biography-fiction": [
        "01-fiction", "02-literary-fiction", "03-fantasy-science-fiction",
        "04-poetry-drama", "05-film-media", "06-music",
        "07-art-design-photography", "08-biography-memoir",
        "09-literary-criticism-theory", "10-creative-arts",
    ],
}

# ─── OLD SUBCATEGORY -> NEW SUBCATEGORY MAPPING KEYWORDS ─────────────
SUBCAT_KEYWORDS = {
    "learning": ("01-learning-productivity", "01-learning-foundations"),
    "education": ("01-learning-productivity", "01-learning-foundations"),
    "pedagogy": ("01-learning-productivity", "01-learning-foundations"),
    "habit": ("01-learning-productivity", "02-habit-formation"),
    "deep-work": ("01-learning-productivity", "03-deep-work-focus"),
    "focus": ("01-learning-productivity", "03-deep-work-focus"),
    "note-taking": ("01-learning-productivity", "04-note-taking-knowledge-management"),
    "knowledge-management": ("01-learning-productivity", "04-note-taking-knowledge-management"),
    "creativity": ("01-learning-productivity", "05-creativity-innovation"),
    "skill": ("01-learning-productivity", "07-skill-acquisition-mastery"),
    "mastery": ("01-learning-productivity", "07-skill-acquisition-mastery"),

    "cognitive": ("02-psychology-human-behavior", "01-cognitive-psychology"),
    "behavioral": ("02-psychology-human-behavior", "02-behavioral-psychology"),
    "social-psych": ("02-psychology-human-behavior", "03-social-psychology"),
    "motivation": ("02-psychology-human-behavior", "04-motivation-emotion"),
    "emotion": ("02-psychology-human-behavior", "04-motivation-emotion"),
    "personality": ("02-psychology-human-behavior", "05-personality-individual-differences"),
    "developmental": ("02-psychology-human-behavior", "06-developmental-psychology"),
    "positive": ("02-psychology-human-behavior", "07-positive-psychology"),
    "clinical": ("02-psychology-human-behavior", "08-clinical-psychology-mental-health"),
    "mental-health": ("02-psychology-human-behavior", "08-clinical-psychology-mental-health"),
    "learning-theory": ("02-psychology-human-behavior", "09-learning-theory"),

    "decision": ("03-decision-making-systems-thinking", "01-mental-models"),
    "mental-model": ("03-decision-making-systems-thinking", "01-mental-models"),
    "probability": ("03-decision-making-systems-thinking", "02-probability-uncertainty"),
    "uncertainty": ("03-decision-making-systems-thinking", "02-probability-uncertainty"),
    "random": ("03-decision-making-systems-thinking", "02-probability-uncertainty"),
    "forecast": ("03-decision-making-systems-thinking", "03-forecasting-prediction"),
    "prediction": ("03-decision-making-systems-thinking", "03-forecasting-prediction"),
    "bets": ("03-decision-making-systems-thinking", "03-forecasting-prediction"),
    "risk": ("03-decision-making-systems-thinking", "04-risk-resilience"),
    "resilience": ("03-decision-making-systems-thinking", "04-risk-resilience"),
    "black-swan": ("03-decision-making-systems-thinking", "02-probability-uncertainty"),
    "systems": ("03-decision-making-systems-thinking", "05-systems-thinking"),
    "bias": ("03-decision-making-systems-thinking", "06-cognitive-biases-debiasing"),
    "rationality": ("03-decision-making-systems-thinking", "07-rationality-judgment"),
    "game": ("03-decision-making-systems-thinking", "08-game-theory"),

    "warn": ("04-philosophy-religion", "01-western-philosophy"),  # western
    "eastern": ("04-philosophy-religion", "03-eastern-philosophy"),
    "indian": ("04-philosophy-religion", "02-indian-philosophy"),
    "vedanta": ("04-philosophy-religion", "02-indian-philosophy"),
    "philosophy": ("04-philosophy-religion", "01-western-philosophy"),
    "ethics": ("04-philosophy-religion", "04-ethics-moral-philosophy"),
    "moral": ("04-philosophy-religion", "04-ethics-moral-philosophy"),
    "logic": ("04-philosophy-religion", "05-logic-critical-thinking"),
    "critical-thinking": ("04-philosophy-religion", "05-logic-critical-thinking"),
    "religion": ("04-philosophy-religion", "06-religion-spirituality"),
    "spirit": ("04-philosophy-religion", "06-religion-spirituality"),
    "faith": ("04-philosophy-religion", "06-religion-spirituality"),
    "abrahamic": ("04-philosophy-religion", "06-religion-spirituality"),
    "comparative": ("04-philosophy-religion", "07-comparative-philosophy"),

    "medicine": ("05-health-medicine-life-sciences", "01-medicine-clinical-science"),
    "health": ("05-health-medicine-life-sciences", "01-medicine-clinical-science"),
    "neuroscience": ("05-health-medicine-life-sciences", "02-neuroscience-brain-health"),
    "brain": ("05-health-medicine-life-sciences", "02-neuroscience-brain-health"),
    "nutrition": ("05-health-medicine-life-sciences", "03-nutrition-diet"),
    "diet": ("05-health-medicine-life-sciences", "03-nutrition-diet"),
    "exercise": ("05-health-medicine-life-sciences", "04-exercise-science-fitness"),
    "fitness": ("05-health-medicine-life-sciences", "04-exercise-science-fitness"),
    "sleep": ("05-health-medicine-life-sciences", "05-sleep-science"),
    "longev": ("05-health-medicine-life-sciences", "06-longevity-aging"),
    "aging": ("05-health-medicine-life-sciences", "06-longevity-aging"),
    "biology": ("05-health-medicine-life-sciences", "07-biology-life-sciences"),
    "evolution": ("05-health-medicine-life-sciences", "07-biology-life-sciences"),
    "gene": ("05-health-medicine-life-sciences", "07-biology-life-sciences"),
    "species": ("05-health-medicine-life-sciences", "07-biology-life-sciences"),

    "personal-finance": ("06-finance-investing", "01-personal-finance-wealth-building"),
    "wealth": ("06-finance-investing", "01-personal-finance-wealth-building"),
    "money": ("06-finance-investing", "01-personal-finance-wealth-building"),
    "millionaire": ("06-finance-investing", "01-personal-finance-wealth-building"),
    "rich": ("06-finance-investing", "01-personal-finance-wealth-building"),
    "value-invest": ("06-finance-investing", "02-value-investing"),
    "intelligent-investor": ("06-finance-investing", "02-value-investing"),
    "security-analysis": ("06-finance-investing", "02-value-investing"),
    "index": ("06-finance-investing", "03-index-investing-passive"),
    "passive": ("06-finance-investing", "03-index-investing-passive"),
    "behavioral-finance": ("06-finance-investing", "04-behavioral-finance"),
    "nudge": ("06-finance-investing", "04-behavioral-finance"),
    "contrarian": ("06-finance-investing", "05-advanced-contrarian-investing"),
    "bitcoin": ("06-finance-investing", "05-advanced-contrarian-investing"),
    "flash-boys": ("06-finance-investing", "05-advanced-contrarian-investing"),
    "quantitative": ("06-finance-investing", "07-quantitative-finance"),
    "hedge": ("06-finance-investing", "07-quantitative-finance"),
    "alternative": ("06-finance-investing", "13-alternative-investments"),

    "entrepreneurship": ("07-business-management-entrepreneurship", "01-entrepreneurship-startups"),
    "startup": ("07-business-management-entrepreneurship", "01-entrepreneurship-startups"),
    "lean": ("07-business-management-entrepreneurship", "01-entrepreneurship-startups"),
    "strategy": ("07-business-management-entrepreneurship", "02-business-strategy"),
    "leadership": ("07-business-management-entrepreneurship", "03-leadership-executive-development"),
    "leader": ("07-business-management-entrepreneurship", "03-leadership-executive-development"),
    "executive": ("07-business-management-entrepreneurship", "03-leadership-executive-development"),
    "management": ("07-business-management-entrepreneurship", "04-management-organizational-behavior"),
    "organizational": ("07-business-management-entrepreneurship", "04-management-organizational-behavior"),
    "marketing": ("07-business-management-entrepreneurship", "05-marketing-brand-strategy"),
    "brand": ("07-business-management-entrepreneurship", "05-marketing-brand-strategy"),
    "advertising": ("07-business-management-entrepreneurship", "05-marketing-brand-strategy"),
    "operations": ("07-business-management-entrepreneurship", "06-operations-supply-chain"),
    "supply": ("07-business-management-entrepreneurship", "06-operations-supply-chain"),
    "product-management": ("07-business-management-entrepreneurship", "07-product-management"),
    "sales": ("07-business-management-entrepreneurship", "08-sales-business-development"),
    "accounting": ("07-business-management-entrepreneurship", "09-corporate-finance-accounting"),
    "consulting": ("07-business-management-entrepreneurship", "10-consulting-frameworks"),

    "writing": ("08-communication-language-writing", "01-writing-craft"),
    "nonfiction": ("08-communication-language-writing", "02-nonfiction-writing"),
    "story": ("08-communication-language-writing", "03-storytelling"),
    "persuasion": ("08-communication-language-writing", "04-persuasion-rhetoric"),
    "rhetoric": ("08-communication-language-writing", "04-persuasion-rhetoric"),
    "influence": ("08-communication-language-writing", "04-persuasion-rhetoric"),
    "negotiation": ("08-communication-language-writing", "04-persuasion-rhetoric"),
    "public-speaking": ("08-communication-language-writing", "05-public-speaking-presentation"),
    "presentation": ("08-communication-language-writing", "05-public-speaking-presentation"),
    "communication": ("08-communication-language-writing", "06-communication-theory"),
    "linguistic": ("08-communication-language-writing", "07-linguistics"),
    "language": ("08-communication-language-writing", "08-language-learning"),

    "world-history": ("09-history-society-politics", "01-world-history-civilizations"),
    "civilization": ("09-history-society-politics", "01-world-history-civilizations"),
    "big-history": ("09-history-society-politics", "01-world-history-civilizations"),
    "intellectual": ("09-history-society-politics", "02-history-ideas-intellectual-history"),
    "sociology": ("09-history-society-politics", "03-sociology"),
    "anthropology": ("09-history-society-politics", "04-anthropology"),
    "political-science": ("09-history-society-politics", "05-political-science"),
    "geopolitics": ("09-history-society-politics", "06-geopolitics-international-relations"),
    "international": ("09-history-society-politics", "06-geopolitics-international-relations"),
    "policy": ("09-history-society-politics", "07-public-policy-governance"),
    "governance": ("09-history-society-politics", "07-public-policy-governance"),
    "law": ("09-history-society-politics", "10-law-legal-systems"),
    "legal": ("09-history-society-politics", "10-law-legal-systems"),
    "economics": ("09-history-society-politics", "07-public-policy-governance"),
    "economic": ("09-history-society-politics", "07-public-policy-governance"),
    "biography": ("09-history-society-politics", "08-biography-memoir-history"),
    "memoir": ("09-history-society-politics", "08-biography-memoir-history"),
    "cultural": ("09-history-society-politics", "09-cultural-studies"),

    "mathematics": ("10-mathematics-science-technology", "01-mathematics"),
    "math": ("10-mathematics-science-technology", "01-mathematics"),
    "algebra": ("10-mathematics-science-technology", "01-mathematics"),
    "calculus": ("10-mathematics-science-technology", "01-mathematics"),
    "geometry": ("10-mathematics-science-technology", "01-mathematics"),
    "statistics": ("10-mathematics-science-technology", "02-statistics-probability"),
    "probability": ("10-mathematics-science-technology", "02-statistics-probability"),
    "physics": ("10-mathematics-science-technology", "03-physics"),
    "quantum": ("10-mathematics-science-technology", "03-physics"),
    "relativity": ("10-mathematics-science-technology", "03-physics"),
    "chemistry": ("10-mathematics-science-technology", "04-chemistry"),
    "popular-science": ("10-mathematics-science-technology", "05-popular-science"),
    "computer-science": ("10-mathematics-science-technology", "06-computer-science"),
    "computer": ("10-mathematics-science-technology", "06-computer-science"),
    "programming": ("10-mathematics-science-technology", "06-computer-science"),
    "software": ("10-mathematics-science-technology", "07-software-engineering"),
    "system-design": ("10-mathematics-science-technology", "08-system-design-scalability"),
    "scalability": ("10-mathematics-science-technology", "08-system-design-scalability"),
    "artificial": ("10-mathematics-science-technology", "09-ai-machine-learning"),
    "machine-learning": ("10-mathematics-science-technology", "09-ai-machine-learning"),
    "deep-learning": ("10-mathematics-science-technology", "09-ai-machine-learning"),
    "algorithm": ("10-mathematics-science-technology", "10-data-algorithms"),
    "data-struct": ("10-mathematics-science-technology", "10-data-algorithms"),
    "data-intensive": ("10-mathematics-science-technology", "08-system-design-scalability"),
    "devops": ("10-mathematics-science-technology", "11-devops-sre-platform-engineering"),
    "sre": ("10-mathematics-science-technology", "11-devops-sre-platform-engineering"),
    "networking": ("10-mathematics-science-technology", "12-networking-distributed-systems"),
    "network": ("10-mathematics-science-technology", "12-networking-distributed-systems"),
    "distributed": ("10-mathematics-science-technology", "12-networking-distributed-systems"),
    "microservices": ("10-mathematics-science-technology", "12-networking-distributed-systems"),
    "security": ("10-mathematics-science-technology", "13-cybersecurity"),
    "cryptography": ("10-mathematics-science-technology", "13-cybersecurity"),
    "engineering": ("10-mathematics-science-technology", "14-engineering-general"),
    "technology": ("10-mathematics-science-technology", "14-engineering-general"),
    "electronics": ("10-mathematics-science-technology", "14-engineering-general"),
    "nature": ("10-mathematics-science-technology", "05-popular-science"),
    "ecology": ("10-mathematics-science-technology", "05-popular-science"),
    "environment": ("10-mathematics-science-technology", "05-popular-science"),

    "fiction": ("11-arts-media-biography-fiction", "01-fiction"),
    "literary-fiction": ("11-arts-media-biography-fiction", "02-literary-fiction"),
    "fantasy": ("11-arts-media-biography-fiction", "03-fantasy-science-fiction"),
    "science-fiction": ("11-arts-media-biography-fiction", "03-fantasy-science-fiction"),
    "poetry": ("11-arts-media-biography-fiction", "04-poetry-drama"),
    "drama": ("11-arts-media-biography-fiction", "04-poetry-drama"),
    "performing": ("11-arts-media-biography-fiction", "04-poetry-drama"),
    "film": ("11-arts-media-biography-fiction", "05-film-media"),
    "music": ("11-arts-media-biography-fiction", "06-music"),
    "art": ("11-arts-media-biography-fiction", "07-art-design-photography"),
    "design": ("11-arts-media-biography-fiction", "07-art-design-photography"),
    "photography": ("11-arts-media-biography-fiction", "07-art-design-photography"),
    "biography": ("11-arts-media-biography-fiction", "08-biography-memoir"),
    "memoir": ("11-arts-media-biography-fiction", "08-biography-memoir"),
    "literary-criticism": ("11-arts-media-biography-fiction", "09-literary-criticism-theory"),
    "literary-theory": ("11-arts-media-biography-fiction", "09-literary-criticism-theory"),
    "creative": ("11-arts-media-biography-fiction", "10-creative-arts"),
}

def map_to_new_subcategory(new_cat: str, old_sub_name: str) -> str:
    """Map old subcategory name to new subcategory path."""
    old_sub_lower = old_sub_name.lower().replace("-", " ").replace("_", " ")
    for keyword, (cat, sub) in SUBCAT_KEYWORDS.items():
        if cat == new_cat and keyword in old_sub_lower:
            return sub
    # Fallback: use first subcategory of target
    if new_cat in NEW_SUBCATEGORIES:
        return NEW_SUBCATEGORIES[new_cat][0]
    return "01-other"

def slugify(text: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

def normalize_title(t: str) -> str:
    return slugify(t)

def book_folder_name(slug: str, number: int) -> str:
    return f"{number:03d}-{slug}"

def scan_existing():
    """Scan all existing books with meta.json."""
    books = []
    for root, dirs, files in os.walk(KNOWLEDGE):
        if "meta.json" in files:
            rel = os.path.relpath(root, KNOWLEDGE)
            parts = rel.split(os.sep)
            old_cat = parts[0] if len(parts) > 0 else ""
            old_sub = parts[1] if len(parts) > 1 else ""
            slug = os.path.basename(root)

            meta_path = os.path.join(root, "meta.json")
            try:
                with open(meta_path, encoding="utf-8") as f:
                    meta = json.load(f)
            except:
                meta = {}

            title = meta.get("title", "")
            authors = meta.get("authors", [])
            author = authors[0] if isinstance(authors, list) and authors else meta.get("author", "")

            books.append({
                "path": root,
                "old_rel": rel,
                "slug": slug,
                "title": title,
                "author": author,
                "old_cat": old_cat,
                "old_sub": old_sub,
                "new_cat": None,
                "new_sub": None,
                "new_number": 0,
            })
    return books

def assign_new_locations(books):
    """Assign new category and subcategory to each book."""
    # Track number within each new subcategory
    sub_counts = defaultdict(int)

    for book in books:
        new_cat = OLD_TO_NEW_CAT.get(book["old_cat"], "11-arts-media-biography-fiction")
        new_sub = map_to_new_subcategory(new_cat, book["old_sub"])
        book["new_cat"] = new_cat
        book["new_sub"] = new_sub

        sub_counts[(new_cat, new_sub)] += 1
        book["new_number"] = sub_counts[(new_cat, new_sub)]

    return books

def execute_migration(books, dry_run=True):
    """Create new directory structure and copy books from SOURCE."""
    global SOURCE
    actions = []
    source_base = SOURCE if SOURCE else KNOWLEDGE

    # First create all category and subcategory dirs
    new_dirs_created = set()
    for book in books:
        new_cat = book["new_cat"]
        new_sub = book["new_sub"]
        cat_dir = KNOWLEDGE / new_cat
        sub_dir = cat_dir / new_sub

        if (new_cat, new_sub) not in new_dirs_created:
            actions.append(f"CREATE {new_cat}/{new_sub}")
            new_dirs_created.add((new_cat, new_sub))
            if not dry_run:
                sub_dir.mkdir(parents=True, exist_ok=True)

    # Then copy each book
    moved = 0
    for book in books:
        new_cat = book["new_cat"]
        new_sub = book["new_sub"]
        num = book["new_number"]
        new_dir_name = book_folder_name(book["slug"], num)
        new_path = KNOWLEDGE / new_cat / new_sub / new_dir_name

        # Source path relative to source_base
        src_root = book["path"]
        actions.append(f"MOVE {book['old_rel']} -> {new_cat}/{new_sub}/{new_dir_name}")

        if not dry_run:
            new_path.mkdir(parents=True, exist_ok=True)
            # Copy files from src_root
            if os.path.isdir(src_root):
                for fname in os.listdir(src_root):
                    src = os.path.join(src_root, fname)
                    dst = os.path.join(new_path, fname)
                    if os.path.isfile(src):
                        shutil.copy2(src, dst)

                # Update meta.json
                meta_path = new_path / "meta.json"
                if meta_path.exists():
                    try:
                        with open(meta_path, encoding="utf-8") as f:
                            meta = json.load(f)
                        meta["category"] = new_cat
                        meta["subcategory"] = new_sub
                        with open(meta_path, "w", encoding="utf-8") as f:
                            json.dump(meta, f, indent=2, ensure_ascii=False)
                    except:
                        pass
        moved += 1

    return actions, moved

def main():
    dry_run = "--execute" not in sys.argv

    print("Scanning existing books...")
    books = scan_existing()
    print(f"Found {len(books)} existing books")

    print("Assigning new locations...")
    books = assign_new_locations(books)

    # Stats
    cat_counts = defaultdict(int)
    sub_counts = defaultdict(int)
    for b in books:
        cat_counts[b["new_cat"]] += 1
        sub_counts[(b["new_cat"], b["new_sub"])] += 1

    print(f"\nNew category distribution:")
    for cat, count in sorted(cat_counts.items()):
        print(f"  {cat}: {count} books")

    print(f"\nNew subcategory distribution:")
    for (cat, sub), count in sorted(sub_counts.items()):
        print(f"  {cat}/{sub}: {count} books")

    if dry_run:
        print(f"\n--- DRY RUN --- Would move {len(books)} books")
        # Show first 20 moves
        for b in books[:20]:
            num = b["new_number"]
            nd = book_folder_name(b["slug"], num)
            print(f"  {b['old_rel']} -> {b['new_cat']}/{b['new_sub']}/{nd}")
        if len(books) > 20:
            print(f"  ... and {len(books)-20} more")
        print("\nUse --execute to apply changes.")
        return

    # Confirm
    global SOURCE
    # Copy old tree to archive (safer than rename which can get permission errors)
    SOURCE = ARCHIVE
    if not ARCHIVE.exists() or not any(ARCHIVE.iterdir()):
        print(f"\nArchiving old tree to {ARCHIVE}...")
        if ARCHIVE.exists():
            shutil.rmtree(ARCHIVE)
        shutil.copytree(str(KNOWLEDGE), str(ARCHIVE))
    else:
        print(f"\nArchive already exists at {ARCHIVE}, using it")
    KNOWLEDGE.mkdir(parents=True, exist_ok=True)

    # Update book paths to point to archive
    for book in books:
        old_path = book["path"]
        rel_path = os.path.relpath(old_path, str(ROOT / "knowledge"))
        book["path"] = str(ARCHIVE / rel_path)

    print("Executing migration...")
    actions, moved = execute_migration(books, dry_run=False)
    print(f"\nMigrated {moved} books to new 11-category structure")
    print(f"Old structure preserved in {ARCHIVE}")

    # Clean up old directories from knowledge/ that are not in new 11 categories
    new_cats = set(k for k in OLD_TO_NEW_CAT.values() if k)
    old_dirs = [d for d in os.listdir(KNOWLEDGE) if os.path.isdir(KNOWLEDGE / d)]
    removed = 0
    for d in old_dirs:
        if d not in new_cats:
            path = KNOWLEDGE / d
            if path.exists():
                shutil.rmtree(path)
                removed += 1
                print(f"  REMOVED old directory: {d}")
    if removed:
        print(f"Cleaned up {removed} old directories from knowledge/")
    else:
        print("No old directories to clean")

    print("\nNext steps:")
    print("  1. Run 'pnpm typecheck' to validate")
    print("  2. Generate category/subcategory index files")
    print("  3. Generate missing book content files")

if __name__ == "__main__":
    main()
