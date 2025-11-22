# Quick Build Instructions

## How to Convert This Site to Static HTML

### Prerequisites
Make sure you have Node.js installed (version 18 or higher).

### Step-by-Step Instructions

1. **Open Terminal/PowerShell in the project folder**

2. **Install dependencies** (first time only):
   ```bash
   npm install
   ```

3. **Build the static HTML site**:
   ```bash
   npm run build
   ```

4. **Find your HTML files**:
   - All HTML files are now in the `out/` folder
   - `out/index.html` - Homepage
   - `out/kingdoms/` - All kingdom pages
   - `out/kings/` - All king pages
   - `out/sites/` - All site pages

5. **Preview the site locally**:
   ```bash
   npx serve out
   ```
   Then open your browser to the URL shown (usually http://localhost:3000)

6. **Deploy to GitHub Pages** (optional):
   ```bash
   npm run deploy
   ```

---

## File Structure After Build

```
out/
├── index.html                    # Homepage
├── kingdoms.html                 # Kingdoms listing page
├── kings.html                    # Kings listing page
├── sites.html                    # Sites listing page
├── connections.html              # Connections page
│
├── kingdoms/
│   ├── tambapanni.html
│   ├── anuradhapura.html
│   ├── polonnaruwa.html
│   ├── kandyan.html
│   └── ... (all kingdoms)
│
├── kings/
│   ├── vijaya.html
│   ├── dutugemunu.html
│   ├── devanampiya-tissa.html
│   └── ... (all kings)
│
├── sites/
│   ├── anuradhapura-site.html
│   ├── polonnaruwa-site.html
│   └── ... (all sites)
│
└── _next/
    └── static/
        ├── css/          # All stylesheets
        └── chunks/       # JavaScript files
```

---

## For Your HTML Collaborator

### What They Can Do:

1. **View the built HTML files** in the `out/` folder
2. **Open any HTML file** in a browser to see how it looks
3. **Edit HTML directly** in the `out/` folder (but changes will be lost on rebuild)
4. **Edit data files** in `data/` folder and rebuild for permanent changes

### What They Should Know:

- The `out/` folder is regenerated each time you run `npm run build`
- To make permanent changes, edit:
  - `data/kingdoms.json` - Kingdom data
  - `data/kings.json` - King data
  - `data/sites.json` - Site data
  - Then rebuild with `npm run build`

### Example Files:

I've created example HTML files in the `examples/` folder:
- `example-kingdom-page.html` - Shows how a kingdom page looks
- `example-king-page.html` - Shows how a king page looks

These are pure HTML/CSS files they can understand!

---

## Troubleshooting

### Build fails?
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port already in use?
```bash
# Use a different port
npx serve out -p 3001
```

### Changes not showing?
```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

---

## Important Notes

✅ Your site is **already configured** for static HTML export
✅ The `next.config.ts` has `output: 'export'` enabled
✅ Images are set to `unoptimized: true` for static export
✅ The base path is configured for GitHub Pages deployment

🎉 You're ready to generate HTML files anytime!
