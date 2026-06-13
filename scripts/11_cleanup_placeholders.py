#!/usr/bin/env python3
"""
BookAtlas Cleanup Script
Removes placeholder books and index.mdx files from leaf categories.
"""

import os
import shutil
from pathlib import Path

KNOWLEDGE_DIR = Path("knowledge")

def cleanup_leaf_categories():
    """Remove placeholder files and directories from leaf categories."""
    for top_cat in KNOWLEDGE_DIR.iterdir():
        if not top_cat.is_dir():
            continue
        
        for leaf_cat in top_cat.iterdir():
            if not leaf_cat.is_dir():
                continue
            
            # Remove index.mdx from leaf categories
            index_file = leaf_cat / "index.mdx"
            if index_file.exists():
                index_file.unlink()
                print(f"Removed: {index_file}")
            
            # Remove placeholder book directories (books without meta.json)
            for book_dir in leaf_cat.iterdir():
                if book_dir.is_dir():
                    meta_file = book_dir / "meta.json"
                    if not meta_file.exists():
                        shutil.rmtree(book_dir)
                        print(f"Removed placeholder: {book_dir}")

if __name__ == "__main__":
    cleanup_leaf_categories()