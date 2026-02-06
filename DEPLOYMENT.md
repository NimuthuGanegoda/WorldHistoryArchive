# Automatic Deployment Guide

This website is configured for **automatic continuous deployment** to GitHub Pages. Every time you push changes to the `main` branch, the website is automatically rebuilt and deployed.

## How It Works

### Automatic Deployment Process

1. **Push to `main` branch** → GitHub Actions workflow triggers automatically
2. **Install dependencies** (`npm ci`) → Ensures consistent builds
3. **Build the application** (`npm run build`) → Generates optimized static files
4. **Deploy to GitHub Pages** → Live website updates within 1-2 minutes

### GitHub Actions Workflows

Two workflows handle the deployment:

- **`.github/workflows/nextjs.yml`** - Primary deployment workflow
- **`.github/workflows/deploy.yml`** - Backup deployment workflow

Both workflows trigger on:
- ✅ Every push to the `main` branch
- ✅ Manual trigger via "Run workflow" button in GitHub

## Making Updates

### Simple Workflow

```bash
# 1. Make your changes
# Edit data files, components, or pages

# 2. Commit changes
git add .
git commit -m "Update description of your changes"

# 3. Push to GitHub
git push origin main

# Done! ✨ Your website will auto-deploy in 1-2 minutes
```

### What Gets Updated

These file changes **automatically trigger a rebuild and deploy**:

- **Data files**: `src/data/*.json` (kings, kingdoms, sites)
- **Components**: `src/components/**`
- **Pages**: `src/app/**`
- **Styles**: `src/app/globals.css`, `tailwind.config.ts`
- **Dependencies**: `package.json` (if new packages added)

### Monitoring Deployment Status

**Option 1: GitHub Actions Tab**
```
1. Go to: https://github.com/NimuthuGanegoda/WorldHistoryArchive/actions
2. See the workflow run status
3. Click on a run to see detailed logs
```

**Option 2: Direct Verification**
- Visit https://srilankanhistory.dev/ to verify changes are live
- Changes typically appear within 1-2 minutes after push

## Common Tasks

### Add a New King/Kingdom/Site

1. Edit the JSON file in `src/data/`:
   ```bash
   nano src/data/kings.json      # Add new king entry
   nano src/data/kingdoms.json   # Add new kingdom entry
   nano src/data/sites.json      # Add new archaeological site
   ```

2. Commit and push:
   ```bash
   git add src/data/
   git commit -m "Add new historical entry"
   git push origin main
   ```

3. Website automatically rebuilds with your changes ✨

### Update Historical Information

1. Edit the relevant JSON file
2. Commit and push
3. Changes go live automatically

### Add New Feature/Component

1. Create/modify files in `src/components/` or `src/app/`
2. Make sure dependencies are in `package.json`
3. Commit and push
4. GitHub Actions installs dependencies, builds, and deploys

## Important Notes

⚠️ **Things to Remember:**

- ✅ Always ensure `npm run build` passes locally before pushing:
  ```bash
  npm run build
  ```
  
- ✅ Keep dependencies in `package.json` synced with imports:
  - If you add a new package: `npm install package-name`
  - Update `package.json` automatically gets committed
  
- ✅ The `out/` directory is auto-generated and NOT committed to git
  - GitHub Actions builds and deploys it automatically
  - Don't manually edit files in `out/`

## Troubleshooting

### Website Didn't Update After Push

**Check deployment status:**
```bash
# Visit GitHub Actions to see if workflow is running
# https://github.com/NimuthuGanegoda/WorldHistoryArchive/actions
```

**If workflow failed:**
- Check the error logs in GitHub Actions
- Common causes:
  - Missing dependencies in `package.json`
  - Syntax errors in JSON/TypeScript files
  - Uncaught build errors

**To fix:**
```bash
npm install          # Install all dependencies
npm run build        # Test build locally
npm run lint         # Check for linting errors
git push origin main # Push fix to trigger re-deploy
```

### Build Error: Module Not Found

**Solution:**
```bash
# Install missing package
npm install package-name

# Commit and push
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push origin main
```

## GitHub Pages Configuration

Your site is configured to:
- **Source**: GitHub Actions workflow artifacts
- **Domain**: https://srilankanhistory.dev/
- **SSL**: Automatically enabled
- **Updates**: Automatic on every push to `main`

### Current Settings

To verify/modify GitHub Pages settings:
1. Go to https://github.com/NimuthuGanegoda/WorldHistoryArchive/settings/pages
2. Ensure:
   - Source: "GitHub Actions"
   - Custom domain: "srilankanhistory.dev" (if using custom domain)

## Performance Optimization

The site uses:
- ✅ Static generation for all pages
- ✅ Tailwind CSS for optimized styling
- ✅ Next.js image optimization (unoptimized for static export)
- ✅ Gzip compression (configured in `_headers`)

## Need Help?

1. **Check GitHub Actions logs**: Most issues are visible there
2. **Build locally first**: `npm run build`
3. **Validate data**: `npm run validate`
4. **Review recent commits**: `git log --oneline -10`

---

**Summary**: Push to `main` → Automatic build & deploy → Website updates! 🚀
