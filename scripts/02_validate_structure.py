#!/usr/bin/env python3
"""
BookAtlas Validation Script
Validates the structure and content of the knowledge base.
"""

import os
import json
import re
from pathlib import Path
from typing import List, Dict, Tuple, Optional

KNOWLEDGE_DIR = Path("knowledge")

class BookValidator:
    """Validates book files and structure."""
    
    def __init__(self):
        self.errors: List[str] = []
        self.warnings: List[str] = []
    
    def validate_slug(self, slug: str) -> bool:
        """Validate slug format."""
        if not slug:
            self.errors.append(f"Empty slug in {self.current_book}")
            return False
        if not re.match(r'^[a-z0-9-]+$', slug):
            self.errors.append(f"Invalid slug format: {slug}")
            return False
        return True
    
    def validate_metadata(self, meta_path: Path) -> Optional[Dict]:
        """Validate meta.json file."""
        if not meta_path.exists():
            self.warnings.append(f"Missing meta.json in {meta_path.parent.name}")
            return None
        
        try:
            with open(meta_path, encoding='utf-8') as f:
                meta = json.load(f)
        except json.JSONDecodeError as e:
            self.errors.append(f"Invalid JSON in {meta_path}: {e}")
            return None
        except Exception as e:
            self.warnings.append(f"Cannot read {meta_path}: {e}")
            return None
        
        required_fields = ["slug", "title", "author", "year", "isbn", "pageCount"]
        for field in required_fields:
            if field not in meta:
                self.warnings.append(f"Missing field '{field}' in {meta_path}")
        
        if "year" in meta and not isinstance(meta["year"], int):
            self.errors.append(f"Invalid year in {meta_path}")
        
        return meta
    
    def validate_mdx_file(self, mdx_path: Path, required_sections: List[str]) -> bool:
        """Validate MDX file structure."""
        if not mdx_path.exists():
            self.errors.append(f"Missing file: {mdx_path}")
            return False
        
        try:
            content = mdx_path.read_text(encoding='utf-8', errors='ignore')
        except Exception as e:
            self.errors.append(f"Cannot read {mdx_path}: {e}")
            return False
        
        for section in required_sections:
            if section not in content:
                self.warnings.append(f"Missing section '{section}' in {mdx_path}")
        
        if content.count("#") > 50:
            self.warnings.append(f"Too many headings in {mdx_path}")
        
        return True
    
    def validate_book(self, book_dir: Path) -> Dict:
        """Validate a single book directory."""
        self.current_book = book_dir.name
        results = {"book": book_dir.name, "valid": True, "errors": [], "warnings": []}
        
        meta = self.validate_metadata(book_dir / "meta.json")
        if meta:
            self.validate_slug(meta.get("slug", ""))
        
        self.validate_mdx_file(book_dir / "index.mdx", ["Executive Summary", "Key Takeaways"])
        self.validate_mdx_file(book_dir / "01-content.mdx", ["Reading Guide"])
        self.validate_mdx_file(book_dir / "02-analysis.mdx", ["Strengths", "Weaknesses"])
        
        results["errors"] = self.errors.copy()
        results["warnings"] = self.warnings.copy()
        results["valid"] = len(self.errors) == 0
        
        self.errors.clear()
        self.warnings.clear()
        
        return results
    
    def validate_category(self, category_dir: Path) -> List[Dict]:
        """Validate all books in a category."""
        results = []
        for leaf_dir in category_dir.iterdir():
            if not leaf_dir.is_dir():
                continue
            for book_dir in leaf_dir.iterdir():
                if book_dir.is_dir():
                    results.append(self.validate_book(book_dir))
        return results


def validate_hierarchy() -> List[str]:
    """Validate the overall directory hierarchy."""
    errors = []
    
    for category in KNOWLEDGE_DIR.iterdir():
        if not category.is_dir():
            continue
        
        for leaf in category.iterdir():
            if not leaf.is_dir():
                continue
            
            for sub in leaf.iterdir():
                if sub.is_dir():
                    errors.append(f"Third-level category found: {sub}")
    
    return errors


def validate_all() -> Dict:
    """Run all validations."""
    validator = BookValidator()
    results = {
        "hierarchy_errors": validate_hierarchy(),
        "categories": {}
    }
    
    for category in KNOWLEDGE_DIR.iterdir():
        if not category.is_dir():
            continue
        results["categories"][category.name] = validator.validate_category(category)
    
    return results


def main():
    results = validate_all()
    
    print("=" * 60)
    print("VALIDATION RESULTS")
    print("=" * 60)
    
    if results["hierarchy_errors"]:
        print("\nHIERARCHY ERRORS:")
        for e in results["hierarchy_errors"]:
            print(f"  X {e}")
    else:
        print("\n[OK] Hierarchy is valid")
    
    print("\nBOOK VALIDATION:")
    for cat, books in results["categories"].items():
        for book in books:
            if book["valid"]:
                print(f"  [OK] {book['book']}")
            else:
                print(f"  [X] {book['book']}")
                for e in book["errors"]:
                    print(f"      Error: {e}")


if __name__ == "__main__":
    main()