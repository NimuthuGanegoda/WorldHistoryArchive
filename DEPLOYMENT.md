# 🚀 Deployment Handbook (Go SSG on GitHub Pages)

## Overview

This website automatically builds and deploys to **GitHub Pages** at:
**`https://nimuthuganegoda.github.io/WorldHistoryArchive/`**

The deployment is handled natively by the Go Static Site Generator (SSG) via GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) whenever commits are merged into `main`.

---

## ⚙️ Architecture & Build Pipeline

1. **Trigger**: Push to `main`, manual dispatch, or daily UTC cron (for spotlight rotation).
2. **Build Engine**: Pure Go binary compiles static HTML, JSON API endpoints, and assets to `./dist`.
3. **GitHub Pages Deploy**: Deploys `./dist` artifact directly to GitHub Pages with `.nojekyll` and `404.html` fallback.

```bash
# Local static build command
./wha build --out dist
```
```

### Build Output
- **Location**: `./out` directory
- **Pages**: 248+ static HTML pages
- **Assets**: Optimized CSS, JS, and images

## Troubleshooting

### Build Failures

#### Google Fonts Error
**Error**: `Failed to fetch from Google Fonts`
**Solution**: Use Tailwind system fonts
```tsx
// ❌ DON'T
import { Inter } from 'next/font/google';

// ✅ DO
<body className="font-sans">
```

#### Duplicate Workflow Conflicts
**Error**: `Missing environment. Ensure your workflow's deployment job has an environment`
**Solution**: Remove duplicate workflows, keep only `nextjs.yml`

#### Network Restrictions
**Error**: Build hangs or fails to fetch external resources
**Solution**: Remove all external dependencies (fonts, CDNs, etc.)

### Deployment Verification

1. **Check Workflow Status**:
   - Visit: https://github.com/NimuthuGanegoda/WorldHistoryArchive/actions
   - Look for green checkmarks ✅

2. **Check Website**:
   - Visit: https://srilankanhistory.dev/
   - Verify your changes are live

3. **Check Build Logs**:
   - Click on workflow run
   - Review build and deploy job logs

## Custom Domain Setup

The website uses a custom domain: `srilankanhistory.dev`

### Configuration
- **CNAME File**: `/CNAME` contains the domain
- **DNS Settings**: Configured externally at domain registrar
- **HTTPS**: Automatically enabled by GitHub Pages

## Performance & Security

### Build Optimizations
- Static site generation (SSG)
- Optimized assets and images
- Minimal JavaScript bundle
- CDN delivery via GitHub Pages

### Security Headers
Configured in `next.config.ts` (note: only work in dev mode with static export):
- Strict-Transport-Security
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection

For production, configure these headers in your DNS/hosting provider if needed.

## Maintenance

### Regular Tasks
- ✅ Keep dependencies updated: `npm update`
- ✅ Test builds before pushing to main
- ✅ Monitor workflow runs for failures
- ✅ Validate data integrity: `npm run validate`

### Best Practices
1. Work on feature branches, not directly on `main`
2. Test locally before creating pull requests
3. Review workflow logs if deployment fails
4. Keep the single workflow pattern (no duplicates)

## Support

If you encounter deployment issues:

1. Check GitHub Actions logs for detailed error messages
2. Verify local build works: `npm run build`
3. Ensure no external dependencies (fonts, CDNs) are added
4. Confirm only `nextjs.yml` workflow exists

---

**Last Updated**: February 2026
**Deployment Method**: GitHub Actions + GitHub Pages
**Build Time**: ~2-3 minutes
**Uptime Target**: 99.9%
