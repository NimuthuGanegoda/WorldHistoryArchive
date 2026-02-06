# Quick Start: Making Updates

## Three Simple Steps to Update Your Website

### 1️⃣ Make Changes
Edit any file in your project:
- Update `src/data/kings.json` - Add/edit kings
- Update `src/data/kingdoms.json` - Add/edit kingdoms  
- Update `src/data/sites.json` - Add/edit archaeological sites
- Edit components or pages in `src/`

### 2️⃣ Commit & Push
```bash
git add .
git commit -m "Your description of changes"
git push origin main
```

### 3️⃣ Done! ✨
Your website automatically updates in 1-2 minutes at:
**https://srilankanhistory.dev/**

---

## Examples

### Add a New King
```bash
# Edit the kings.json file
nano src/data/kings.json
# Add your new king entry to the JSON array

# Commit and push
git add src/data/kings.json
git commit -m "Add King Rajasinha details"
git push origin main

# Your new king appears on the website in ~2 minutes!
```

### Update Kingdom Information
```bash
nano src/data/kingdoms.json
# Make your edits

git add src/data/kingdoms.json
git commit -m "Update Anuradhapura era information"
git push origin main
```

### Add a New Archaeological Site
```bash
nano src/data/sites.json
# Add new site entry

git add src/data/sites.json
git commit -m "Add new temple site"
git push origin main
```

---

## Check Deployment Status

### Option 1: GitHub Actions (Recommended)
https://github.com/NimuthuGanegoda/WorldHistoryArchive/actions

See all workflow runs and their status.

### Option 2: Just Visit Your Site
https://srilankanhistory.dev/

If your changes are there, deployment is complete!

---

## Important: Always Test Locally First

Before pushing, make sure the build works:
```bash
npm run build
```

If you get errors, fix them locally, then push.

### ⚠️ Common Build Issues to Avoid

**1. Never Use Google Fonts**
```bash
# ❌ DO NOT USE - This will cause build failures:
import { Inter } from 'next/font/google'

# ✅ USE INSTEAD - Tailwind system fonts:
className="font-sans"
```

**Why?** The build environment has restricted network access and cannot fetch from `fonts.googleapis.com`. This causes all builds to fail.

**2. Check Dependencies**
Always ensure new packages are in `package.json`:
```bash
npm install package-name
git add package.json package-lock.json
```

**3. Validate Data Files**
Before pushing JSON changes:
```bash
npm run validate
```

---

## If Something Goes Wrong

### Build failed?
```bash
npm install          # Install all dependencies
npm run build        # Check for errors
npm run lint         # Check for syntax issues
```

### Need to add a package?
```bash
npm install leaflet  # Example package name
git add package.json package-lock.json
git commit -m "Add leaflet package"
git push origin main
```

---

## That's It! 🚀

Your workflow:
```
Edit files → git push → Auto-deploy → Website updated
```

For detailed guide, see: [DEPLOYMENT.md](./DEPLOYMENT.md)
