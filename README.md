# The Landing Page

Simple static single-page web app to manage links: large clickable list, sorted by clicks, search, settings, import/export, and bookmarks (.html) import.

Run locally (serve the folder) and open in a browser:

```bash
python3 -m http.server 8000
# then browse to http://localhost:8000
```

## Deployment
Just upload the contents of this directory (`index.html`, `styles.css`, `app.js`, etc.) to any static host (GitHub Pages, Netlify, S3, your own webserver). No build step required.

## Storage considerations
All data lives in the browser's `localStorage` (~5 MB per origin), which typically holds on the order of 10 000 links depending on title/URL lengths. If storage becomes full you'll see an alert and subsequent changes won't persist; exporting to JSON and clearing some entries is the workaround. The app proactively catches quota errors on every save attempt and notifies you, so you’re never left wondering why clicks or new links aren’t being recorded.


Features:
- Click a link to open and increment its click counter (re-sorts by clicks)
- Search bar filters list; if no results and you press Enter or click Search, it opens your configured search engine
- Add / Edit / Delete links
- Settings: set favorite search engine (use %s where query goes), import/export JSON, import bookmarks HTML
