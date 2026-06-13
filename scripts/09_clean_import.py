#!/usr/bin/env python3
"""
BookAtlas Clean Import Script
Cleanly imports books from knowledge-archive with proper structure.
"""

import os
import json
import shutil
from pathlib import Path

KNOWLEDGE_DIR = Path("knowledge")
ARCHIVE_DIR = Path("knowledge-archive")

# Category mapping
CATEGORY_MAPPINGS = {
    "25-artificial-intelligence-machine-learning": "04-computers-ai-and-software",
    "26-technology-engineering": "04-computers-ai-and-software",
    "27-biography-memoir": "10-fiction-and-literature",
    "28-fiction": "10-fiction-and-literature",
    "29-poetry-drama-performing-arts": "10-fiction-and-literature",
    "30-music-film-media": "10-fiction-and-literature",
    "31-architecture-art-design": "10-fiction-and-literature",
    "32-literary-criticism-theory": "06-philosophy-religion-and-indian-thought",
}

# Leaf category mapping
LEAF_MAPPINGS = {
    "04-computers-ai-and-software": {
        "deep-learning-and-neural-architectures": "artificial-intelligence",
        "machine-learning-foundations": "artificial-intelligence",
        "mlops-and-production-ai": "artificial-intelligence",
        "natural-language-processing": "artificial-intelligence",
        "reinforcement-learning": "artificial-intelligence",
        "bioinformatics-and-computational-biology": "engineering-and-technology",
        "civil-and-infrastructure-engineering": "engineering-and-technology",
        "electrical-and-electronics-engineering": "engineering-and-technology",
        "energy-and-sustainability-engineering": "engineering-and-technology",
        "materials-science-and-nanotechnology": "engineering-and-technology",
        "mechanical-engineering": "engineering-and-technology",
        "robotics-and-automation": "engineering-and-technology",
    },
    "10-fiction-and-literature": {
        "art-and-design": "art-and-design",
        "film-and-media-studies": "film-and-media-studies",
        "music": "music",
        "poetry-and-drama": "poetry-and-drama",
        "speculative-fiction": "speculative-fiction",
        "historical-biography-and-memoir": "literary-biography-and-memoir",
        "literary-biography-and-memoir": "literary-biography-and-memoir",
    },
    "06-philosophy-religion-and-indian-thought": {
        "literary-criticism": "literary-criticism",
    }
}

def clean_and_import():
    """Clean existing structure and import from archive."""
    imported = []
    
    for legacy_cat, new_top in CATEGORY_MAPPINGS.items():
        cat_path = ARCHIVE_DIR / legacy_cat
        if not cat_path.exists():
            continue
        
        leaf_mappings = LEAF_MAPPINGS.get(new_top, {})
        
        for legacy_leaf, new_leaf in leaf_mappings.items():
            leaf_path = cat_path / legacy_leaf
            if not leaf_path.exists():
                continue
            
            target_leaf = KNOWLEDGE_DIR / new_top / new_leaf
            target_leaf.mkdir(parents=True, exist_ok=True)
            
            for book_dir in leaf_path.iterdir():
                if not book_dir.is_dir():
                    continue
                
                target_book = target_leaf / book_dir.name
                
                # Remove conflicting index.mdx if exists
                if (target_book / "index.mdx").exists():
                    (target_book / "index.mdx").unlink()
                
                # Move book
                shutil.move(str(book_dir), str(target_book))
                imported.append(str(target_book))
                print(f"Imported: {book_dir.name}")
    
    print(f"\nImported {len(imported)} books")

if __name__ == "__main__":
    clean_and_import()