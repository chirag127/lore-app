"""
Generate category/subcategory index files for all 11 categories.
Creates 01-index.mdx, 02-reading-order.mdx, 03-book-list.mdx, 04-meta.json
for every category and subcategory folder.
"""
import os, json, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KNOWLEDGE = ROOT / "knowledge"

CATEGORIES = {
    "01-learning-productivity": {
        "number": "01",
        "name": "Learning & Productivity",
        "description": "Meta-learning, study methods, deep work, skill acquisition, habits, creativity. Read first before any other category.",
        "order": "01 -> 02 -> 07 -> 03 -> 04 -> 06 -> 05",
    },
    "02-psychology-human-behavior": {
        "number": "02",
        "name": "Psychology & Human Behavior",
        "description": "Cognitive, social, clinical, developmental, and positive psychology. How humans think, feel, and behave.",
        "order": "01 -> 02 -> 03 -> 04 -> 05 -> 09 -> 06 -> 07 -> 08",
    },
    "03-decision-making-systems-thinking": {
        "number": "03",
        "name": "Decision Making & Systems Thinking",
        "description": "Mental models, probability, risk, forecasting, rationality, game theory, and systems thinking.",
        "order": "01 -> 06 -> 02 -> 03 -> 07 -> 04 -> 05 -> 08",
    },
    "04-philosophy-religion": {
        "number": "04",
        "name": "Philosophy & Religion",
        "description": "Western, Eastern, and Indian philosophy, ethics, logic, religion, and spirituality.",
        "order": "01 -> 05 -> 04 -> 02 -> 03 -> 07 -> 06",
    },
    "05-health-medicine-life-sciences": {
        "number": "05",
        "name": "Health, Medicine & Life Sciences",
        "description": "Medicine, neuroscience, nutrition, fitness, sleep, longevity, biology, and mental health.",
        "order": "01 -> 02 -> 07 -> 03 -> 04 -> 05 -> 06 -> 08",
    },
    "06-finance-investing": {
        "number": "06",
        "name": "Finance & Investing",
        "description": "Personal finance, value investing, index investing, behavioral finance, risk, and markets.",
        "order": "01 -> 02 -> 03 -> 04 -> 06 -> 05 -> 08 -> 07 -> 09 -> 10 -> 11 -> 12 -> 13",
    },
    "07-business-management-entrepreneurship": {
        "number": "07",
        "name": "Business, Management & Entrepreneurship",
        "description": "Startups, strategy, leadership, marketing, operations, product management, sales.",
        "order": "01 -> 02 -> 03 -> 04 -> 05 -> 07 -> 06 -> 08 -> 09 -> 10",
    },
    "08-communication-language-writing": {
        "number": "08",
        "name": "Communication, Language & Writing",
        "description": "Writing craft, storytelling, persuasion, rhetoric, public speaking, linguistics.",
        "order": "01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 08",
    },
    "09-history-society-politics": {
        "number": "09",
        "name": "History, Society & Politics",
        "description": "World history, civilizations, sociology, political science, geopolitics, law.",
        "order": "01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 10 -> 09 -> 08",
    },
    "10-mathematics-science-technology": {
        "number": "10",
        "name": "Mathematics, Science & Technology",
        "description": "Math, physics, chemistry, CS, software engineering, AI, systems design, engineering.",
        "order": "01 -> 02 -> 05 -> 03 -> 04 -> 06 -> 07 -> 10 -> 08 -> 09 -> 11 -> 12 -> 13 -> 14",
    },
    "11-arts-media-biography-fiction": {
        "number": "11",
        "name": "Arts, Media, Biography & Fiction",
        "description": "Fiction, poetry, drama, music, film, design, biography, literary criticism.",
        "order": "01 -> 02 -> 03 -> 04 -> 06 -> 05 -> 09 -> 10 -> 07 -> 08",
    },
}

def slug_to_name(slug):
    """Convert slug to display name."""
    parts = slug.split("-", 1)
    name = parts[1] if len(parts) > 1 else parts[0]
    return name.replace("-", " ").title()

def get_books_in_subcategory(sub_path):
    """Get all book directories in a subcategory."""
    books = []
    if not sub_path.exists():
        return books
    for book_dir in sorted(sub_path.iterdir()):
        if book_dir.is_dir() and book_dir.name[0].isdigit():
            meta_path = book_dir / "meta.json"
            title = ""
            author = ""
            year = 0
            if meta_path.exists():
                try:
                    with open(meta_path, encoding="utf-8") as f:
                        meta = json.load(f)
                    title = meta.get("title", "")
                    authors = meta.get("authors", [])
                    if isinstance(authors, list) and authors:
                        author = authors[0] if isinstance(authors[0], str) else str(authors[0])
                    else:
                        author = meta.get("author", "")
                    year = meta.get("year", 0)
                except:
                    pass
            books.append({
                "dir": book_dir.name,
                "title": title,
                "author": author,
                "year": year,
            })
    return books

def write_category_index(cat_slug, cat_info):
    """Write index.mdx for a category."""
    cat_dir = KNOWLEDGE / cat_slug
    cat_dir.mkdir(parents=True, exist_ok=True)
    
    # 01-index.mdx
    index_path = cat_dir / "01-index.mdx"
    if not index_path.exists():
        subs = sorted([d.name for d in cat_dir.iterdir() if d.is_dir() and d.name[0].isdigit()])
        sub_links = "\n".join(f"- [{slug_to_name(s)}]({s})" for s in subs)
        content = f"""---
category: "{cat_slug}"
title: "{cat_info['name']}"
number: {cat_info['number']}
---

# {cat_info['name']}

{cat_info['description']}

## Subcategories

{sub_links}

## Reading Order

Start with subcategory {cat_info['order']} for optimal learning progression.
"""
        with open(index_path, "w", encoding="utf-8") as f:
            f.write(content)

    # 02-reading-order.mdx
    order_path = cat_dir / "02-reading-order.mdx"
    if not order_path.exists():
        subs = sorted([d.name for d in cat_dir.iterdir() if d.is_dir() and d.name[0].isdigit()])
        content = f"""---
category: "{cat_slug}"
title: "Reading Order - {cat_info['name']}"
---

# Recommended Reading Order

Each subcategory builds on the previous.

## Suggested Path

{cat_info['order']}

## Rationale

The recommended order progresses from foundational concepts
to specialized applications within this category.
"""
        with open(order_path, "w", encoding="utf-8") as f:
            f.write(content)

    # 03-book-list.mdx
    list_path = cat_dir / "03-book-list.mdx"
    if not list_path.exists():
        books_list = []
        for sub_dir in sorted(cat_dir.iterdir()):
            if sub_dir.is_dir() and sub_dir.name[0].isdigit():
                books = get_books_in_subcategory(sub_dir)
                for b in books:
                    books_list.append(b)
        
        book_entries = "\n".join(
            f"1. **{b['title']}** by {b['author']} ({b['year']})" 
            if b['title'] else f"1. {b['dir']}"
            for b in books_list
        )
        content = f"""---
category: "{cat_slug}"
title: "Book List - {cat_info['name']}"
---

# Complete Book List

{book_entries}
"""
        with open(list_path, "w", encoding="utf-8") as f:
            f.write(content)

    # 04-meta.json
    meta_path = cat_dir / "04-meta.json"
    if not meta_path.exists():
        meta = {
            "slug": cat_slug,
            "title": cat_info["name"],
            "number": int(cat_info["number"]),
            "description": cat_info["description"],
            "subcategories": sorted([d.name for d in cat_dir.iterdir() if d.is_dir() and d.name[0].isdigit()]),
        }
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)

def write_subcategory_index(cat_slug, sub_name):
    """Write index files for a subcategory."""
    sub_dir = KNOWLEDGE / cat_slug / sub_name
    sub_dir.mkdir(parents=True, exist_ok=True)
    
    books = get_books_in_subcategory(sub_dir)
    disp_name = slug_to_name(sub_name)
    
    # 01-index.mdx
    index_path = sub_dir / "01-index.mdx"
    if not index_path.exists():
        book_links = "\n".join(
            f"- [{b['title']}]({b['dir']})" if b['title'] else f"- {b['dir']}"
            for b in books
        )
        content = f"""---
category: "{cat_slug}"
subcategory: "{sub_name}"
title: "{disp_name}"
---

# {disp_name}

## Books ({len(books)})

{book_links}
"""
        with open(index_path, "w", encoding="utf-8") as f:
            f.write(content)

    # 02-reading-order.mdx
    order_path = sub_dir / "02-reading-order.mdx"
    if not order_path.exists():
        book_lines = "\n".join(
            f"1. **{b['title']}**" if b['title'] else f"1. {b['dir']}"
            for b in books
        )
        content = f"""---
category: "{cat_slug}"
subcategory: "{sub_name}"
title: "Reading Order - {disp_name}"
---

# Reading Order

{book_lines}
"""
        with open(order_path, "w", encoding="utf-8") as f:
            f.write(content)

    # 03-book-list.mdx
    list_path = sub_dir / "03-book-list.mdx"
    if not list_path.exists():
        book_entries = "\n".join(
            f"1. **{b['title']}** by {b['author']} ({b['year']})"
            if b['title'] else f"1. {b['dir']}"
            for b in books
        )
        content = f"""---
category: "{cat_slug}"
subcategory: "{sub_name}"
title: "Book List - {disp_name}"
---

# Book List

{book_entries}
"""
        with open(list_path, "w", encoding="utf-8") as f:
            f.write(content)

    # 04-meta.json
    meta_path = sub_dir / "04-meta.json"
    if not meta_path.exists():
        meta = {
            "slug": f"{cat_slug}/{sub_name}",
            "title": disp_name,
            "category": cat_slug,
            "subcategory": sub_name,
            "book_count": len(books),
            "books": [b["dir"] for b in books],
        }
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)

def main():
    print("Generating category index files...")
    for cat_slug, cat_info in CATEGORIES.items():
        cat_dir = KNOWLEDGE / cat_slug
        if not cat_dir.exists():
            print(f"  SKIP: {cat_slug} not found")
            continue
        
        write_category_index(cat_slug, cat_info)
        print(f"  CAT: {cat_slug}")
        
        # Generate for each subcategory
        for sub_dir in sorted(cat_dir.iterdir()):
            if sub_dir.is_dir() and sub_dir.name[0].isdigit():
                write_subcategory_index(cat_slug, sub_dir.name)
                books = get_books_in_subcategory(sub_dir)
                print(f"    SUB: {sub_dir.name} ({len(books)} books)")
    
    print("\nDone! Generated index files for all categories and subcategories.")

if __name__ == "__main__":
    main()
