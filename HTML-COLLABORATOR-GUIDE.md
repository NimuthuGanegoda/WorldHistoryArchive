# HTML Collaborator Guide

## For Collaborators Who Know HTML

This guide will help you understand how to work with this project using only HTML knowledge.

---

## 🎯 What This Project Does

This is a website about Sri Lankan history (kingdoms and kings). It's built with Next.js, but **it exports to pure HTML files** that you can edit directly.

---

## 📁 Project Structure (Simplified)

```
History-/
├── data/                    # JSON data files (like databases)
│   ├── kingdoms.json       # List of all kingdoms
│   ├── kings.json          # List of all kings
│   └── sites.json          # Archaeological sites
│
├── out/                    # 🔥 STATIC HTML FILES (created after build)
│   ├── index.html          # Home page
│   ├── kingdoms/           # Kingdom pages
│   ├── kings/              # King pages
│   └── sites/              # Site pages
│
└── src/                    # Source code (Next.js/React)
```

---

## 🚀 How to Get the HTML Files

### Step 1: Build the Project
Run this command in the terminal:
```bash
npm run build
```

This creates the `out/` folder with **pure HTML files**.

### Step 2: Open the HTML Files
Go to the `out/` folder and you'll find:
- `index.html` - Main homepage
- `kingdoms/` folder - Each kingdom has its own HTML file
- `kings/` folder - Each king has its own HTML file
- `sites/` folder - Each site has its own HTML file

### Step 3: Preview Locally
To see the site:
```bash
npx serve out
```
Or just open `out/index.html` in your browser!

---

## 📝 How to Edit Content

### Option 1: Edit JSON Data (Recommended)
The easiest way to add/edit content is by editing the JSON files:

**Example: Add a new king to `data/kings.json`**
```json
{
  "name": "King Example",
  "slug": "king-example",
  "kingdom": "anuradhapura",
  "reign": "100-120 CE",
  "biography": "This is the king's story..."
}
```

Then rebuild:
```bash
npm run build
```

### Option 2: Edit HTML Directly (After Build)
You can directly edit the HTML files in the `out/` folder.

**Example: Edit `out/index.html`**
```html
<h1>Kingdoms of Sri Lanka</h1>
<p>Explore the rich history...</p>
```

⚠️ **Warning:** If you rebuild the project, your HTML edits will be overwritten!

---

## 🎨 HTML Structure Explained

### Homepage (`out/index.html`)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Kingdoms of Sri Lanka</title>
  <link rel="stylesheet" href="/_next/static/css/...">
</head>
<body>
  <!-- Header Navigation -->
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/kingdoms">Kingdoms</a>
      <a href="/kings">Kings</a>
      <a href="/sites">Sites</a>
    </nav>
  </header>

  <!-- Main Content -->
  <main>
    <h1>Kingdoms of Sri Lanka</h1>
    <div class="kingdoms-grid">
      <!-- Kingdom cards -->
    </div>
  </main>

  <!-- Footer -->
  <footer>
    <p>&copy; 2025 Sri Lanka History</p>
  </footer>
</body>
</html>
```

### Kingdom Page (`out/kingdoms/anuradhapura.html`)
```html
<main>
  <h1>Anuradhapura</h1>
  <p class="period">437 BCE – 1017 CE</p>
  <div class="description">
    <p>First major kingdom; irrigation & Buddhist center</p>
  </div>
  
  <section class="kings-list">
    <h2>Kings of Anuradhapura</h2>
    <!-- List of kings -->
  </section>
</main>
```

---

## 🔧 Common Tasks

### Task 1: Change Site Title
**File:** `out/index.html` (or `src/app/layout.tsx` for permanent change)
```html
<title>Your New Title</title>
```

### Task 2: Add a New Page
1. Create `out/my-page/index.html`
2. Copy structure from `out/index.html`
3. Edit content
4. Add link in navigation

### Task 3: Edit Styling
The CSS is in `out/_next/static/css/` folder. It uses Tailwind CSS classes.

Common classes:
- `text-center` - Center text
- `bg-blue-500` - Blue background
- `p-4` - Padding
- `m-4` - Margin
- `text-2xl` - Large text

---

## 📊 Understanding the Data Files

### kingdoms.json
```json
[
  {
    "id": "anuradhapura",
    "name": "Anuradhapura",
    "period": "437 BCE – 1017 CE",
    "description": "First major kingdom..."
  }
]
```

### kings.json
```json
[
  {
    "name": "King Vijaya",
    "slug": "vijaya",
    "kingdom": "tambapanni",
    "reign": "543–505 BCE",
    "biography": "King Vijaya is the legendary first king..."
  }
]
```

### sites.json
```json
[
  {
    "id": "anuradhapura-site",
    "name": "Sacred City of Anuradhapura",
    "location": "Anuradhapura District",
    "description": "UNESCO World Heritage Site..."
  }
]
```

---

## 🌐 Deployment

The site is configured for GitHub Pages. After building:

```bash
npm run deploy
```

This publishes the `out/` folder to: `https://nimuthuganegoda.github.io/History-/`

---

## 📚 HTML Workflow Summary

1. **Edit Data:** Change `data/*.json` files
2. **Rebuild:** Run `npm run build`
3. **Check Output:** Look at `out/` folder
4. **Preview:** Open `out/index.html` in browser
5. **Deploy:** Run `npm run deploy` (if authorized)

---

## 🆘 Help & Tips

### Tip 1: Always Preview Before Deploying
Open `out/index.html` locally first!

### Tip 2: Keep Backups
Before editing HTML directly, copy the file first.

### Tip 3: Use Browser Inspector
Right-click → "Inspect Element" to see HTML structure.

### Tip 4: JSON Validation
Use https://jsonlint.com/ to check if your JSON is valid.

---

## 📧 Questions?

If you need to:
- Add new pages → Edit data JSON and rebuild
- Change styling → Edit CSS or Tailwind classes
- Fix broken links → Check href attributes in HTML
- Add images → Put in `public/` folder, reference as `/image.jpg`

**Remember:** The `out/` folder is your pure HTML website! 🎉
