#!/usr/bin/env python3
"""
BookAtlas Merge Script
Merges books from knowledge-archive into the new knowledge structure.
"""

import os
import json
import shutil
from pathlib import Path
from typing import Dict, Tuple

KNOWLEDGE_DIR = Path("knowledge")
ARCHIVE_DIR = Path("knowledge-archive")

# Category mapping from archive to new structure
CATEGORY_MAPPINGS = {
    "25-artificial-intelligence-machine-learning": {
        "deep-learning-and-neural-architectures": "artificial-intelligence",
        "machine-learning-foundations": "artificial-intelligence",
        "mlops-and-production-ai": "artificial-intelligence",
        "natural-language-processing": "artificial-intelligence",
        "reinforcement-learning": "artificial-intelligence",
    },
    "26-technology-engineering": {
        "biomedical-engineering": "engineering-and-technology",
        "civil-and-infrastructure-engineering": "engineering-and-technology",
        "electrical-and-electronics-engineering": "engineering-and-technology",
        "energy-and-sustainability-engineering": "engineering-and-technology",
        "materials-science-and-nanotechnology": "engineering-and-technology",
        "mechanical-engineering": "engineering-and-technology",
        "robotics-and-automation": "engineering-and-technology",
    },
    "27-biography-memoir": {
        "artists-writers-and-musicians": "literary-biography-and-memoir",
        "autobiographies-and-personal-memoirs": "literary-biography-and-memoir",
        "entrepreneurs-and-business-builders": "literary-biography-and-memoir",
        "philosophers-and-intellectuals": "literary-biography-and-memoir",
        "political-and-military-leaders": "historical-biography-and-memoir",
        "scientists-and-mathematicians": "literary-biography-and-memoir",
        "social-activists-and-reformers": "literary-biography-and-memoir",
    },
    "28-fiction": {
        "fantasy": "speculative-fiction",
        "horror-and-gothic-literature": "speculative-fiction",
        "historical-fiction": "literary-fiction",
        "mystery-and-crime-fiction": "speculative-fiction",
        "romance": "speculative-fiction",
        "science-fiction": "speculative-fiction",
    },
    "29-poetry-drama-performing-arts": {
        "drama-and-theatre": "poetry-and-drama",
        "poetry": "poetry-and-drama",
        "performing-arts": "poetry-and-drama",
    },
    "30-music-film-media": {
        "film-studies": "film-and-media-studies",
        "media-studies": "film-and-media-studies",
        "music": "music",
    },
    "31-architecture-art-design": {
        "architecture": "art-and-design",
        "design": "art-and-design",
        "fine-arts": "art-and-design",
        "photography": "art-and-design",
    },
    "32-literary-criticism-theory": {
        "author-studies-and-genre-criticism": "literary-criticism",
        "classical-literary-theory": "literary-criticism",
        "modern-literary-theory": "literary-criticism",
    },
}

def merge_book(book_dir: Path) -> Dict:
    """Merge a single book into the new structure."""
    path_parts = book_dir.relative_to(ARCHIVE_DIR).parts
    
    if len(path_parts) < 3:
        return {"status": "skipped", "reason": "invalid path", "book": book_dir.name}
    
    legacy_cat = path_parts[0]
    legacy_leaf = path_parts[1]
    
    if legacy_cat not in CATEGORY_MAPPINGS:
        return {"status": "skipped", "reason": "unknown category", "book": book_dir.name}
    
    new_top = "04-computers-ai-and-software" if legacy_cat == "25-artificial-intelligence-machine-learning" or legacy_cat == "26-technology-engineering" else \
              "10-fiction-and-literature" if legacy_cat.startswith("27") or legacy_cat.startswith("28") or legacy_cat.startswith("29") or legacy_cat.startswith("30") or legacy_cat.startswith("31") else \
              "06-philosophy-religion-and-indian-thought"
    
    leaf_mapping = CATEGORY_MAPPINGS.get(legacy_cat, {})
    new_leaf = leaf_mapping.get(legacy_leaf, legacy_leaf)
    
    target_dir = KNOWLEDGE_DIR / new_top / new_leaf / book_dir.name
    
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
        "status": "merged",
        "book": book_dir.name,
        "from": str(book_dir),
        "to": str(target_dir),
        "files": copied
    }

def main():
    """Run merge process."""
    print("Starting BookAtlas merge from archive...")
    
    if not ARCHIVE_DIR.exists():
        print("Archive directory not found!")
        return
    
    merges = []
    
    for legacy_cat, leaf_mappings in CATEGORY_MAPPINGS.items():
        cat_path = ARCHIVE_DIR / legacy_cat
        if not cat_path.exists():
            continue
        
        for legacy_leaf, new_leaf in leaf_mappings.items():
            leaf_path = cat_path / legacy_leaf
            if not leaf_path.exists():
                continue
            
            for book_dir in leaf_path.iterdir():
                if book_dir.is_dir():
                    result = merge_book(book_dir)
                    merges.append(result)
    
    print("\n" + "=" * 60)
    print("MERGE SUMMARY")
    print("=" * 60)
    print(f"Merged: {len([m for m in merges if m['status'] == 'merged'])} books")
    print(f"Skipped: {len([m for m in merges if m['status'] == 'skipped'])} books")
    
    # Save report
    with open("merge-report.txt", "w", encoding='utf-8') as f:
        for m in merges:
            if m['status'] == 'merged':
                f.write(f"MERGED: {m['book']}\n")
                f.write(f"  From: {m.get('from', 'N/A')}\n")
                f.write(f"  To: {m.get('to', 'N/A')}\n\n")
    
    print("\nReport saved to merge-report.txt")

if __name__ == "__main__":
    main()