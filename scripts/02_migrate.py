"""
KnowledgeAtlas Migration Script
================================
Maps existing 32-category knowledge tree into the new 10-category
structure defined by 01_curriculum.py. Handles:
- Directory restructuring
- Duplicate deduplication (keeps most complete version)
- meta.json updates (category, subcategory, slug fields)
- Preserves all book content files

Usage:
    python scripts/02_migrate.py --dry-run     # preview changes
    python scripts/02_migrate.py --execute     # apply changes
"""
from __future__ import annotations
import os, sys, json, shutil, re
from difflib import SequenceMatcher
from collections import defaultdict
from pathlib import Path

# Import curriculum
sys.path.insert(0, os.path.dirname(__file__))
from curriculum import build_curriculum, _s, Book

ROOT = Path(__file__).resolve().parent.parent
KNOWLEDGE = ROOT / "knowledge"
ARCHIVE = ROOT / "knowledge-archive"  # backup of old tree

# ─── SIMILARITY MATCHING ─────────────────────────────────────────────

def normalize(text) -> str:
    """Normalize text for comparison."""
    if isinstance(text, list):
        text = text[0] if text else ''
    text = str(text).lower().strip()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text

def title_similarity(a: str, b: str) -> float:
    """Compare two titles/books for similarity."""
    na, nb = normalize(a), normalize(b)
    if na == nb:
        return 1.0
    # Check if one contains the other
    if na in nb or nb in na:
        return 0.9
    return SequenceMatcher(None, na, nb).ratio()

def author_similarity(a: str, b: str) -> float:
    """Compare author names."""
    na, nb = normalize(a), normalize(b)
    if na == nb:
        return 1.0
    # Check last name match
    a_parts = na.split()
    b_parts = nb.split()
    if a_parts and b_parts and a_parts[-1] == b_parts[-1]:
        return 0.8
    return SequenceMatcher(None, na, nb).ratio()

def match_score(book_title: str, book_author: str, candidate_title: str, candidate_author: str) -> float:
    """Combined match score for title+author."""
    ts = title_similarity(book_title, candidate_title)
    au = author_similarity(book_author, candidate_author)
    # Title matters more
    return ts * 0.7 + au * 0.3

# ─── SCAN EXISTING BOOKS ─────────────────────────────────────────────

def scan_books() -> list[dict]:
    """Scan all existing books in knowledge/ tree."""
    books = []
    for root, dirs, files in os.walk(KNOWLEDGE):
        if 'meta.json' in files:
            rel = os.path.relpath(root, KNOWLEDGE)
            meta_path = os.path.join(root, 'meta.json')
            try:
                with open(meta_path, encoding='utf-8') as f:
                    meta = json.load(f)
            except Exception as e:
                print(f"  WARN: Could not read {rel}/meta.json: {e}")
                continue

            # Normalize fields
            title = meta.get('title', '')
            authors = meta.get('authors', [])
            if isinstance(authors, list) and authors:
                author = authors[0] if isinstance(authors[0], str) else str(authors[0])
            elif meta.get('author'):
                author = meta['author']
            else:
                author = ''

            # Count content files
            content_files = [f for f in files if f.endswith('.mdx') or f == 'meta.json']
            has_04 = any('04-problems' in f for f in files)

            books.append({
                'path': root,
                'rel': rel,
                'slug': os.path.basename(root),
                'title': title,
                'author': author,
                'files': content_files,
                'file_count': len(content_files),
                'has_problems': has_04,
                'meta': meta,
            })
    return books

# ─── MATCHING ─────────────────────────────────────────────────────────

def find_best_match(book: dict, curriculum_books: list[Book]) -> tuple[Book | None, float]:
    """Find the best matching curriculum book for an existing book."""
    best_book = None
    best_score = 0.0

    for cb in curriculum_books:
        score = match_score(book['title'], book['author'], cb.title, cb.author)
        if score > best_score:
            best_score = score
            best_book = cb

    return best_book, best_score

# ─── MIGRATION LOGIC ─────────────────────────────────────────────────

def build_migration_plan(existing_books: list[dict], curriculum_books: list[Book]) -> dict:
    """
    Build a migration plan:
    - matched: books that map to curriculum entries
    - unmatched: books that don't match any curriculum entry
    - needed: curriculum entries with no matching existing book
    - duplicates: books that match the same curriculum entry
    """
    # Score threshold for a valid match
    THRESHOLD = 0.5

    matched = {}  # curriculum_book.slug -> list of existing books
    unmatched = []

    for book in existing_books:
        cb, score = find_best_match(book, curriculum_books)
        if cb and score >= THRESHOLD:
            key = cb.slug
            if key not in matched:
                matched[key] = []
            matched[key].append((book, score))
        else:
            unmatched.append((book, cb, score))

    # For each curriculum entry, pick the best existing book
    final_matches = {}  # curriculum_book -> existing_book
    duplicates = {}     # curriculum_book -> [other existing books]
    needed = []         # curriculum books with no match

    for cb in curriculum_books:
        if cb.slug in matched:
            candidates = matched[cb.slug]
            # Sort by score (best first), then by file count (most complete first)
            candidates.sort(key=lambda x: (-x[1], -x[0]['file_count']))
            final_matches[cb] = candidates[0][0]
            if len(candidates) > 1:
                duplicates[cb] = [c[0] for c in candidates[1:]]
        else:
            needed.append(cb)

    return {
        'final_matches': final_matches,
        'duplicates': duplicates,
        'needed': needed,
        'unmatched': unmatched,
    }

# ─── DIRECTORY OPERATIONS ─────────────────────────────────────────────

def create_new_structure(plan: dict, dry_run: bool = True) -> list[str]:
    """Create the new directory structure and move books."""
    actions = []
    curriculum = build_curriculum()

    for cat in curriculum:
        cat_dir = KNOWLEDGE / cat.slug
        if not dry_run:
            cat_dir.mkdir(parents=True, exist_ok=True)

        for sub in cat.subcategories:
            sub_dir = cat_dir / f"{sub.number:02d}-{sub.slug}"
            if not dry_run:
                sub_dir.mkdir(parents=True, exist_ok=True)

            for book in sub.books:
                if book in plan['final_matches']:
                    existing = plan['final_matches'][book]
                    new_dir = sub_dir / f"{book.number:03d}-{book.slug}"

                    action = f"MOVE {os.path.relpath(existing['path'], KNOWLEDGE)} -> {os.path.relpath(new_dir, KNOWLEDGE)}"
                    actions.append(action)

                    if not dry_run:
                        # Copy existing book to new location
                        if new_dir.exists():
                            shutil.rmtree(new_dir)
                        shutil.copytree(existing['path'], new_dir)

                        # Update meta.json
                        meta_path = new_dir / 'meta.json'
                        if meta_path.exists():
                            with open(meta_path, encoding='utf-8') as f:
                                meta = json.load(f)

                            # Update category/subcategory fields
                            meta['category'] = cat.slug
                            meta['subcategory'] = f"{sub.number:02d}-{sub.slug}"
                            meta['book_number'] = book.number
                            meta['curriculum_slug'] = book.slug

                            # Normalize author field
                            if 'authors' in meta and isinstance(meta['authors'], list):
                                if meta['authors']:
                                    meta['author'] = meta['authors'][0] if isinstance(meta['authors'][0], str) else str(meta['authors'][0])

                            with open(meta_path, 'w', encoding='utf-8') as f:
                                json.dump(meta, f, indent=2, ensure_ascii=False)

                        # Update index.mdx - ensure it has category/subcategory in frontmatter
                        index_path = new_dir / 'index.mdx'
                        if index_path.exists():
                            content = index_path.read_text(encoding='utf-8')
                            # Add frontmatter if not present
                            if not content.startswith('---'):
                                frontmatter = f"""---
category: "{cat.slug}"
subcategory: "{sub.number:02d}-{sub.slug}"
book_number: {book.number}
title: "{book.title}"
author: "{book.author}"
year: {book.year}
---
"""
                                content = frontmatter + content
                                index_path.write_text(content, encoding='utf-8')
                else:
                    # This is a needed book (no existing match)
                    new_dir = sub_dir / f"{book.number:03d}-{book.slug}"
                    action = f"NEED {os.path.relpath(new_dir, KNOWLEDGE)} (generate new)"
                    actions.append(action)

    return actions

# ─── ARCHIVE OLD TREE ─────────────────────────────────────────────────

def archive_old_tree(dry_run: bool = True) -> str:
    """Move the old knowledge tree to knowledge-archive."""
    if dry_run:
        return f"ARCHIVE {KNOWLEDGE} -> {ARCHIVE}"

    if ARCHIVE.exists():
        shutil.rmtree(ARCHIVE)
    shutil.move(str(KNOWLEDGE), str(ARCHIVE))
    KNOWLEDGE.mkdir(parents=True, exist_ok=True)
    return f"Archived old tree to {ARCHIVE}"

# ─── REPORT ───────────────────────────────────────────────────────────

def print_report(plan: dict, actions: list[str]):
    """Print migration report."""
    print("\n" + "=" * 70)
    print("MIGRATION REPORT")
    print("=" * 70)

    print(f"\nMatched books: {len(plan['final_matches'])}")
    print(f"Duplicates found: {sum(len(v) for v in plan['duplicates'].values())}")
    print(f"Books still needed: {len(plan['needed'])}")
    print(f"Unmatched old books: {len(plan['unmatched'])}")

    if plan['needed']:
        print(f"\n--- Books to Generate ({len(plan['needed'])}) ---")
        for cb in plan['needed']:
            print(f"  {cb.number:03d}. {cb.title} -- {cb.author} ({cb.year})")

    if plan['unmatched']:
        print(f"\n--- Unmatched Old Books ({len(plan['unmatched'])}) ---")
        for book, cb, score in plan['unmatched']:
            print(f"  {book['rel']} (best match: {cb.title if cb else 'none'}, score: {score:.2f})")

    print(f"\n--- Actions ({len(actions)}) ---")
    for a in actions[:50]:
        print(f"  {a}")
    if len(actions) > 50:
        print(f"  ... and {len(actions) - 50} more")

# ─── MAIN ─────────────────────────────────────────────────────────────

def main():
    dry_run = '--execute' not in sys.argv

    print("Scanning existing books...")
    existing = scan_books()
    print(f"Found {len(existing)} existing books")

    print("Building curriculum...")
    curriculum = build_curriculum()
    all_cb = []
    for cat in curriculum:
        for sub in cat.subcategories:
            all_cb.extend(sub.books)
    print(f"Curriculum has {len(all_cb)} planned books")

    print("Matching books...")
    plan = build_migration_plan(existing, all_cb)

    print("Building migration plan...")
    actions = create_new_structure(plan, dry_run=dry_run)

    print_report(plan, actions)

    if dry_run:
        print("\n--- DRY RUN --- No changes made. Use --execute to apply.")
    else:
        print("\nExecuting archive...")
        archive_msg = archive_old_tree(dry_run=False)
        print(archive_msg)
        print("\nMigration complete!")

if __name__ == '__main__':
    main()
