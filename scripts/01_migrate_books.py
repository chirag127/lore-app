#!/usr/bin/env python3
"""
BookAtlas Migration Script
Migrates books from legacy structure to new normalized hierarchy.
"""

import os
import json
import shutil
from pathlib import Path
from typing import List, Dict, Tuple

# Configuration
KNOWLEDGE_DIR = Path("knowledge")
BACKUP_DIR = Path("archive/legacy")

# Top-level categories mapping
TOP_CATEGORIES = {
    "01-mind-behavior-and-human-performance": "01-mind-behavior-and-human-performance",
    "02-body-health-and-life-sciences": "02-body-health-and-life-sciences",
    "03-money-markets-and-wealth": "03-money-markets-and-wealth",
    "04-computers-ai-and-software": "04-computers-ai-and-software",
    "05-business-strategy-and-organizations": "05-business-strategy-and-organizations",
    "06-philosophy-religion-and-indian-thought": "06-philosophy-religion-and-indian-thought",
    "07-math-logic-and-science": "07-math-logic-and-science",
    "08-society-history-and-power": "08-society-history-and-power",
    "09-communication-writing-and-creativity": "09-communication-writing-and-creativity",
    "10-fiction-and-literature": "10-fiction-and-literature",
}

# Leaf category mappings (old -> new)
LEAF_MAPPINGS = {
    # Mind & Behavior
    "cognitive-psychology": "cognitive-and-behavioral-psychology",
    "behavioral-science": "cognitive-and-behavioral-psychology",
    "decision-making": "mental-models-and-decision-making",
    "mental-models": "mental-models-and-decision-making",
    "habits": "habits-productivity-and-focus",
    "productivity": "habits-productivity-and-focus",
    "focus": "habits-productivity-and-focus",
    "learning": "learning-and-skill-acquisition",
    "skill-acquisition": "learning-and-skill-acquisition",
    "creativity": "creativity-and-innovation",
    "innovation": "creativity-and-innovation",
    "cognitive-biases": "cognitive-biases-and-rationality",
    "biases": "cognitive-biases-and-rationality",
    "systems-thinking": "systems-thinking-and-game-theory",
    "game-theory": "systems-thinking-and-game-theory",
    "probability": "probability-forecasting-and-risk",
    "forecasting": "probability-forecasting-and-risk",
    "risk": "probability-forecasting-and-risk",
    "social-psychology": "social-positive-and-clinical-psychology",
    
    # Body & Health
    "neuroscience": "neuroscience-and-brain-health",
    "sleep": "sleep-science",
    "nutrition": "nutrition-and-diet",
    "fitness": "exercise-and-fitness",
    "longevity": "longevity-and-aging",
    "aging": "longevity-and-aging",
    "medicine": "medicine-and-clinical-science",
    "clinical": "medicine-and-clinical-science",
    "psychiatry": "psychiatry-and-mental-health",
    "biology": "biology-and-life-sciences",
    
    # Money & Markets
    "investing": "value-and-index-investing",
    "personal-finance": "personal-finance-and-wealth-building",
    "finance": "personal-finance-and-wealth-building",
    "real-estate": "real-estate",
    "real-estate-investing": "real-estate",
    "venture-capital": "venture-capital-and-private-equity",
    "vc": "venture-capital-and-private-equity",
    "private-equity": "venture-capital-and-private-equity",
    "behavioral-finance": "behavioral-finance",
    "economics": "economics",
    "financial-history": "financial-history",
    "advanced-investing": "advanced-investing-and-risk",
    
    # Computers & Software
    "ai": "artificial-intelligence",
    "machine-learning": "artificial-intelligence",
    "ml": "artificial-intelligence",
    "software-engineering": "software-engineering",
    "programming": "software-engineering",
    "system-design": "system-design-and-architecture",
    "distributed-systems": "networking-and-distributed-systems",
    "cybersecurity": "cybersecurity",
    "devops": "devops-and-platform-engineering",
    "data-science": "data-algorithms-and-databases",
    "computer-science": "computer-science-theory",
    
    # Business
    "leadership": "leadership",
    "management": "management-and-organizational-behavior",
    "entrepreneurship": "entrepreneurship-and-startups",
    "marketing": "marketing-and-brand-strategy",
    "operations": "operations-and-supply-chain",
    "product-management": "product-management",
    "sales": "sales-and-business-development",
    "strategy": "business-strategy",
    "consulting": "consulting-and-frameworks",
    "finance": "corporate-finance-and-accounting",
}


def find_books_in_directory(directory: Path) -> List[Tuple[Path, str]]:
    """Find all books in a directory (folders containing index.mdx and 01-content.mdx)."""
    books = []
    if not directory.exists():
        return books
    
    for item in directory.iterdir():
        if item.is_dir():
            has_index = (item / "index.mdx").exists()
            has_content = (item / "01-content.mdx").exists()
            if has_index or has_content:
                book_name = item.name
                books.append((item, book_name))
    return books


def identify_book_structure(book_dir: Path) -> Dict[str, bool]:
    """Identify what files exist in a book directory."""
    return {
        "index": (book_dir / "index.mdx").exists(),
        "content": (book_dir / "01-content.mdx").exists(),
        "analysis": (book_dir / "02-analysis.mdx").exists(),
        "narration": (book_dir / "03-narration.mdx").exists(),
        "meta": (book_dir / "meta.json").exists(),
    }


def create_directory_structure(top_cat: str, leaf_cat: str) -> Path:
    """Create the new directory structure for a book."""
    target_dir = KNOWLEDGE_DIR / top_cat / leaf_cat
    target_dir.mkdir(parents=True, exist_ok=True)
    return target_dir


def migrate_book(book_dir: Path, top_cat: str, leaf_cat: str) -> Dict:
    """Migrate a book to the new structure."""
    target_dir = create_directory_structure(top_cat, leaf_cat)
    book_name = book_dir.name
    target_book_dir = target_dir / book_name
    
    if target_book_dir.exists():
        return {"status": "skipped", "reason": "already exists", "book": book_name}
    
    target_book_dir.mkdir(parents=True, exist_ok=True)
    
    file_structure = identify_book_structure(book_dir)
    migrated = {"status": "migrated", "book": book_name, "files": []}
    
    for filename, exists in file_structure.items():
        if exists:
            source = book_dir / f"{filename}.mdx" if filename != "meta" else book_dir / "meta.json"
            target = target_book_dir / f"{filename}.mdx" if filename != "meta" else target_book_dir / "meta.json"
            if source.exists():
                shutil.copy2(source, target)
                migrated["files"].append(filename)
    
    return migrated


def find_deprecated_directories() -> List[Path]:
    """Find directories that should be removed or archived."""
    deprecated = []
    
    for category_dir in KNOWLEDGE_DIR.iterdir():
        if not category_dir.is_dir():
            continue
        for leaf_dir in category_dir.iterdir():
            if not leaf_dir.is_dir():
                continue
            for sub_dir in leaf_dir.iterdir():
                if sub_dir.is_dir():
                    deprecated.append(sub_dir)
    
    return deprecated


def archive_deprecated(deprecated_dirs: List[Path]) -> None:
    """Archive deprecated directories."""
    if not deprecated_dirs:
        return
    
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    
    for dir_path in deprecated_dirs:
        target = BACKUP_DIR / dir_path.relative_to(KNOWLEDGE_DIR)
        if target.exists():
            shutil.rmtree(target)
        shutil.move(str(dir_path), str(target))
        print(f"Archived: {dir_path}")


def generate_migration_report(migrations: List[Dict], deprecated: List[Dict]) -> str:
    """Generate a summary report of the migration."""
    report = []
    report.append("=" * 60)
    report.append("BOOKATLAS MIGRATION REPORT")
    report.append("=" * 60)
    report.append("")
    report.append("MIGRATED BOOKS:")
    for m in migrations:
        if m["status"] == "migrated":
            report.append(f"  ✓ {m['book']} -> {m.get('target', 'unknown')}")
        elif m["status"] == "skipped":
            report.append(f"  - {m['book']} (skipped: {m.get('reason', 'unknown')})")
    
    report.append("")
    report.append("ARCHIVED DIRECTORIES:")
    for a in deprecated:
        report.append(f"  📁 {a}")
    
    report.append("")
    report.append(f"Total migrations: {len([m for m in migrations if m['status'] == 'migrated'])}")
    report.append(f"Total archived: {len(deprecated)}")
    report.append("")
    return "\n".join(report)


def main():
    """Main migration function."""
    print("Starting BookAtlas migration...")
    
    migrations = []
    deprecated_archives = []
    
    for top_cat in TOP_CATEGORIES.values():
        top_dir = KNOWLEDGE_DIR / top_cat
        if not top_dir.exists():
            continue
        
        for item in top_dir.iterdir():
            if item.is_dir():
                leaf_cat = item.name
                
                if leaf_cat in TOP_CATEGORIES:
                    continue
                
                books = find_books_in_directory(item)
                for book_dir, book_name in books:
                    result = migrate_book(book_dir, top_cat, leaf_cat)
                    result["target"] = f"{top_cat}/{leaf_cat}/{book_name}"
                    migrations.append(result)
    
    deprecated = find_deprecated_directories()
    archive_deprecated(deprecated)
    
    report = generate_migration_report(migrations, deprecated)
    print(report)
    
    with open("migration-report.txt", "w") as f:
        f.write(report)
    
    print("\nMigration complete. Report saved to migration-report.txt")


if __name__ == "__main__":
    main()