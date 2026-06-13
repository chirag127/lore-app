#!/usr/bin/env python3
"""
BookAtlas Hierarchy Fix - Final
Flattens 3-level hierarchy to 2-level structure.
"""

import os
import shutil
from pathlib import Path

KNOWLEDGE_DIR = Path("knowledge")

def fix_hierarchy():
    """Fix the hierarchy by moving books up one level."""
    for top_cat in KNOWLEDGE_DIR.iterdir():
        if not top_cat.is_dir():
            continue
        
        for leaf_cat in top_cat.iterdir():
            if not leaf_cat.is_dir():
                continue
            
            # Check for 3rd level (book directories inside leaf)
            for third_level in list(leaf_cat.iterdir()):
                if third_level.is_dir():
                    # Check if this is a book (has index.mdx or 01-content.mdx)
                    is_book = (third_level / "index.mdx").exists() or \
                              (third_level / "01-content.mdx").exists()
                    
                    if is_book:
                        # Move book to leaf level
                        target = leaf_cat / third_level.name
                        if target.exists():
                            print(f"Conflict: {target} exists, skipping {third_level}")
                            continue
                        
                        shutil.move(str(third_level), str(target))
                        print(f"Moved: {third_level.name} to {leaf_cat.name}")

if __name__ == "__main__":
    fix_hierarchy()