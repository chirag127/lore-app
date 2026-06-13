#!/usr/bin/env python3
"""
BookAtlas Migration Script v2
Migrates books from legacy structure (25-32) to new normalized hierarchy (01-10).
"""

import os
import json
import shutil
import re
from pathlib import Path
from typing import List, Dict, Tuple, Optional

KNOWLEDGE_DIR = Path("knowledge")

# Legacy category to new category mapping
LEGACY_TO_NEW = {
    "25-artificial-intelligence-machine-learning": "04-computers-ai-and-software",
    "26-technology-engineering": "04-computers-ai-and-software",
    "27-biography-memoir": "10-fiction-and-literature",
    "28-fiction": "10-fiction-and-literature",
    "29-poetry-drama-performing-arts": "10-fiction-and-literature",
    "30-music-film-media": "10-fiction-and-literature",
    "31-architecture-art-design": "10-fiction-and-literature",
    "32-literary-criticism-theory": "06-philosophy-religion-and-indian-thought",
}

def find_all_books(base_dir: Path) -> List[Tuple[Path, str]]:
    """Find all books in directory tree."""
    books = []
    for root, dirs, files in os.walk(base_dir):
        root_path = Path(root)
        has_index = "index.mdx" in files
        has_content = "01-content.mdx" in files
        if has_index or has_content:
            books.append((root_path, root_path.name))
    return books

def get_book_metadata(book_dir: Path) -> Optional[Dict]:
    """Extract metadata from book directory."""
    meta_path = book_dir / "meta.json"
    if meta_path.exists():
        try:
            with open(meta_path, encoding='utf-8') as f:
                return json.load(f)
        except:
            pass
    return None

def determine_target_category(book_dir: Path, meta: Optional[Dict] = None) -> Tuple[str, str]:
    """Determine target category and subcategory for a book."""
    path_parts = book_dir.relative_to(KNOWLEDGE_DIR).parts
    
    if len(path_parts) >= 2:
        legacy_cat = path_parts[0]
        if legacy_cat in LEGACY_TO_NEW:
            new_cat = LEGACY_TO_NEW[legacy_cat]
        else:
            new_cat = legacy_cat
    else:
        new_cat = "01-mind-behavior-and-human-performance"
    
    if len(path_parts) >= 3:
        leaf_cat = path_parts[1]
    else:
        leaf_cat = "general"
    
    return new_cat, leaf_cat

def migrate_book(book_dir: Path) -> Dict:
    """Migrate a single book."""
    meta = get_book_metadata(book_dir)
    new_cat, leaf_cat = determine_target_category(book_dir, meta)
    
    target_dir = KNOWLEDGE_DIR / new_cat / leaf_cat / book_dir.name
    
    if target_dir.exists():
        return {"status": "skipped", "reason": "exists", "book": book_dir.name}
    
    target_dir.mkdir(parents=True, exist_ok=True)
    
    files_to_copy = ["index.mdx", "01-content.mdx", "02-analysis.mdx", "03-narration.mdx", "meta.json"]
    copied = []
    
    for f in files_to_copy:
        src = book_dir / f
        if src.exists():
            dst = target_dir / f
            shutil.copy2(src, dst)
            copied.append(f)
    
    return {
        "status": "migrated",
        "book": book_dir.name,
        "from": str(book_dir),
        "to": str(target_dir),
        "files": copied
    }

def archive_directory(dir_path: Path) -> None:
    """Move directory to archive."""
    archive_dir = Path("archive/legacy")
    archive_dir.mkdir(parents=True, exist_ok=True)
    
    target = archive_dir / dir_path.name
    if target.exists():
        shutil.rmtree(target)
    shutil.move(str(dir_path), str(target))

def main():
    """Run migration."""
    print("Starting BookAtlas migration...")
    
    # Find all books in legacy structure
    legacy_categories = ["25-artificial-intelligence-machine-learning", "26-technology-engineering",
                         "27-biography-memoir", "28-fiction", "29-poetry-drama-performing-arts",
                         "30-music-film-media", "31-architecture-art-design", "32-literary-criticism-theory"]
    
    migrations = []
    archived = []
    
    for cat in legacy_categories:
        cat_path = KNOWLEDGE_DIR / cat
        if not cat_path.exists():
            continue
        
        # Find all books in this category
        for item in cat_path.iterdir():
            if item.is_dir():
                result = migrate_book(item)
                result["from"] = str(item)
                migrations.append(result)
        
        # Archive the empty category directory
        if not any(item.is_dir() for item in cat_path.iterdir() if item.name != "index.mdx"):
            archive_directory(cat_path)
            archived.append(cat)
    
    # Print summary
    print("\n" + "=" * 60)
    print("MIGRATION SUMMARY")
    print("=" * 60)
    print(f"Migrated: {len([m for m in migrations if m['status'] == 'migrated'])} books")
    print(f"Skipped: {len([m for m in migrations if m['status'] == 'skipped'])} books")
    print(f"Archived: {len(archived)} categories")
    
    # Save report
    with open("migration-report-v2.txt", "w", encoding='utf-8') as f:
        f.write("BookAtlas Migration Report v2\n")
        f.write("=" * 60 + "\n\n")
        for m in migrations:
            f.write(f"{m['status'].upper()}: {m['book']}\n")
            if m['status'] == 'migrated':
                f.write(f"  From: {m.get('from', 'N/A')}\n")
                f.write(f"  To: {m.get('to', 'N/A')}\n")
    
    print("\nReport saved to migration-report-v2.txt")

if __name__ == "__main__":
    main()