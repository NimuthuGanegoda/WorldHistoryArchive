# World History Archive

World History Archive is a static Next.js knowledge platform for exploring kingdoms, rulers, and archaeological sites through timeline and map-driven storytelling.

The project begins with Sri Lankan historical material and is designed to scale into a broader world-history atlas.

## Why This Project

Historical information is often fragmented across books, chronicles, and disconnected websites. This archive brings those threads together into structured, searchable records that are easier to compare across places and periods.

## What You Can Explore

- Interactive map views of regions, kingdoms, and sites
- Chronological timelines of rulers and dynastic change
- Cross-linked kingdom, monarch, and site pages
- Daily rotating featured rulers for discovery
- Structured JSON datasets that support future analysis and reuse

## Data Architecture

The site UI reads static JSON files from `src/data` for deterministic builds and simple updates.

Core files:

- `src/data/kingdoms.json`: kingdom profiles and historical context
- `src/data/kings.json`: ruler records, reign periods, and biography fields
- `src/data/sites.json`: archaeological and historical location metadata

Note: the root `data` directory contains source and legacy processing datasets used by maintenance scripts.

## Daily Featured Kings

The homepage featured set rotates at Sri Lanka Standard Time midnight (UTC+5:30).

How it works:

- A deterministic shuffle is seeded with the current Asia/Colombo date
- Six rulers are selected from the full dataset
- All users see the same set for a given SL date

Update strategy:

- GitHub Actions rebuilds the static export daily after local midnight in Sri Lanka
- The client also verifies freshness and updates if a page is kept open across date boundaries

Quick verification:

```bash
npm test
node scripts/check-daily-rotation.js
```

## Local Development

1. Install dependencies

```bash
npm install
```

1. Start the dev server

```bash
npm run dev
```

1. Build static output

```bash
npm run build
```

Because this project uses static export, run the built output with a static file server:

```bash
python3 -m http.server out
# or
npx serve out
```

## Contribution Workflow

1. Fork the repository
1. Update or add records in `src/data`
1. Validate dataset integrity
1. Open a pull request with sources and rationale

Validation command:

```bash
npm run validate
```

## Utility Commands

- Validate data: `npm run validate`
- Export markdown: `npm run export:md`
- Verify rotation behavior: `node scripts/verify-rotation.js`
- Preview next 7-day schedule: `node scripts/check-daily-rotation.js`
- Confirm no Google Fonts imports: `node scripts/check-no-google-fonts.js`

CLI helpers:

```bash
node src/cli.js list-kingdoms
node src/cli.js find-king <name>
```

## License

Content is provided for educational and research-oriented use.

© 2026 World History Archive
