import os, json

base = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'knowledge')
books = []
for root, dirs, files in os.walk(base):
    if 'meta.json' in files:
        rel = os.path.relpath(root, base)
        try:
            with open(os.path.join(root, 'meta.json'), encoding='utf-8') as f:
                meta = json.load(f)
            title = meta.get('title', '')
            author = meta.get('author', '')
        except:
            title = ''
            author = ''
        books.append({
            'path': rel,
            'slug': os.path.basename(root),
            'title': title,
            'author': author,
        })

books.sort(key=lambda x: x['path'])
for b in books:
    print(f"{b['path']}  |  {b['title']}  |  {b['author']}")
print(f"\nTotal books: {len(books)}")
