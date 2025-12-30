# GitHub Pages Deployment Guide

This guide explains how to deploy your Sri Lanka History Wiki to GitHub Pages.

## Automatic Deployment (Recommended)

The repository is configured with GitHub Actions for automatic deployment.

### Setup Steps:

1. **Enable GitHub Pages in your repository:**
   - Go to your repository: https://github.com/NimuthuGanegoda/History-
   - Click on **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: Select **GitHub Actions**
   - Save the settings

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

3. **Wait for deployment:**
   - Go to the **Actions** tab in your repository
   - Watch the "Deploy Next.js to GitHub Pages" workflow
   - Once complete, your site will be live at:
     **https://nimuthuganegoda.github.io/History-/**

### How It Works:

- The workflow is defined in `.github/workflows/nextjs.yml`
- It automatically triggers on every push to the `main` branch
- It builds the Next.js app and deploys to GitHub Pages
- You can also manually trigger it from the Actions tab

## Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Build the site
npm run build

# The static files will be in the 'out' directory
# Commit and push to gh-pages branch
git add out -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix out origin gh-pages
```

## Configuration Details

### Next.js Configuration (`next.config.ts`)

```typescript
const nextConfig: NextConfig = {
  output: 'export',           // Static export for GitHub Pages
  basePath: '/History-',      // Repository name as base path
  images: {
    unoptimized: true,        // GitHub Pages doesn't support Image Optimization
  },
};
```

### Important Notes:

1. **Base Path**: All links use the `/History-` base path in production
2. **Static Export**: The site is exported as static HTML/CSS/JS
3. **No Server Features**: API routes and server-side features are not available
4. **Image Optimization**: Disabled (GitHub Pages limitation)

## Troubleshooting

### Issue: 404 errors for pages

**Solution**: Make sure GitHub Pages is set to use GitHub Actions as the source, not the gh-pages branch.

### Issue: CSS/JS not loading

**Solution**: Verify that `basePath` in `next.config.ts` matches your repository name exactly.

### Issue: Workflow fails

**Solution**: Check the Actions tab for error messages. Common issues:
- Missing repository permissions
- Node version mismatch
- Build errors

## Local Testing

To test the production build locally:

```bash
# Build the site
npm run build

# Serve the out directory
npx serve out
```

Then visit: http://localhost:3000/History-

## Updating the Site

Simply push changes to the `main` branch:

```bash
git add .
git commit -m "Update content"
git push origin main
```

The GitHub Actions workflow will automatically rebuild and redeploy your site.

## Site URL

Once deployed, your site will be available at:

**https://nimuthuganegoda.github.io/History-/**

## Repository Settings

Ensure these permissions are enabled:
- Settings → Actions → General → Workflow permissions:
  - ✅ Read and write permissions
  - ✅ Allow GitHub Actions to create and approve pull requests
