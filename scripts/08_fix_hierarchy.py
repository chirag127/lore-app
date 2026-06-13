#!/usr/bin/env python3
"""
BookAtlas Hierarchy Fix Script
Flattens the 3-level hierarchy to match the required 2-level structure.
"""

import os
import shutil
from pathlib import Path

KNOWLEDGE_DIR = Path("knowledge")

# Map of where books currently are to where they should be
MOVE_MAPPINGS = {
    "04-computers-ai-and-software/artificial-intelligence": "04-computers-ai-and-software/artificial-intelligence",
    "04-computers-ai-and-software/engineering-and-technology": "04-computers-ai-and-software/engineering-and-technology",
    "06-philosophy-religion-and-indian-thought/literary-criticism": "06-philosophy-religion-and-indian-thought/literary-criticism",
    "10-fiction-and-literature/art-and-design": "10-fiction-and-literature/art-and-design",
    "10-fiction-and-literature/film-and-media-studies": "10-fiction-and-literature/film-and-media-studies",
    "10-fiction-and-literature/music": "10-fiction-and-literature/music",
    "10-fiction-and-literature/poetry-and-drama": "10-fiction-and-literature/poetry-and-drama",
    "10-fiction-and-literature/speculative-fiction": "10-fiction-and-literature/speculative-fiction",
}

def fix_hierarchy():
    """Fix the hierarchy by moving books to correct locations."""
    for top_cat, leaf_cat in MOVE_MAPPINGS.items():
        leaf_path = KNOWLEDGE_DIR / leaf_cat
        if not leaf_path.exists():
            continue
        
        # Check for 3-level structure
        for subcat in leaf_path.iterdir():
            if subcat.is_dir():
                # This is a 3rd level - move its contents up
                for book in subcat.iterdir():
                    target = leaf_path / book.name
                    if target.exists():
                        print(f"Conflict: {book} vs {target}")
                        continue
                    shutil.move(str(book), str(target))
                    print(f"Moved: {book} -> {target}")
                # Remove empty subdirectory
                try:
                    subcat.rmdir()
                    print(f"Removed empty: {subcat}")
                except:
                    pass

if __name__ == "__main__":
    fix_hierarchy()