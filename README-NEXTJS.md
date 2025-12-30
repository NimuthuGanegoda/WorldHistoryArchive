# Sri Lanka History Wiki

A Next.js application showcasing the historical kingdoms and monarchs of Sri Lanka.

## Getting Started

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
/workspaces/History-/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page (kingdoms list)
│   │   ├── globals.css        # Global styles
│   │   ├── kingdoms/
│   │   │   └── [slug]/        # Dynamic kingdom pages
│   │   │       └── page.tsx
│   │   └── kings/
│   │       └── [slug]/        # Dynamic king biography pages
│   │           └── page.tsx
│   ├── components/            # Reusable React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── KingdomCard.tsx
│   │   └── Breadcrumbs.tsx
│   └── data/                  # JSON data files
│       ├── kingdoms.json      # Kingdom metadata
│       └── kings.json         # Kings/monarchs data
├── scripts/                   # Utility scripts
│   ├── validate.js           # Data validation
│   └── export-markdown.js    # Export to markdown
└── data/                      # Original data files (backup)

```

## Features

- **Dynamic Routing**: Automatically generates pages for all kingdoms and kings
- **Server-Side Rendering**: Fast page loads with Next.js SSR
- **TypeScript**: Type-safe code throughout the application
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS
- **Dark Mode**: Automatic dark mode support
- **Data-Driven**: Content powered by JSON data files

## Data Structure

### Kingdoms (`src/data/kingdoms.json`)
```json
{
  "id": "anuradhapura",
  "name": "Anuradhapura",
  "period": "437 BCE – 1017 CE",
  "description": "First major kingdom; irrigation & Buddhist center"
}
```

### Kings (`src/data/kings.json`)
```json
{
  "id": "devanampiya-tissa",
  "name": "Devanampiya Tissa",
  "slug": "devanampiya-tissa",
  "kingdom": "anuradhapura",
  "reign": "307–267 BCE"
}
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run validate` - Validate JSON data files
- `npm run export:md` - Export data to Markdown

## Migration from Static HTML

The project has been migrated from static HTML to Next.js:

- HTML files → React components (`.tsx`)
- Static routing → Dynamic routing with `[slug]` parameters
- CSS → Tailwind CSS with custom variables
- Manual navigation → Next.js Link components

## Tech Stack

- **Framework**: Next.js 15.x
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Runtime**: Node.js 18+

## License

UNLICENSED - Educational project for Sri Lankan history
