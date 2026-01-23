# Sri Lanka History Data

Data-centric repository cataloging Sri Lankan historical kingdoms and monarchs. This version focuses purely on structured JSON so the dataset can be reused in apps, visualizations, or static site generators.

Note: All prior example HTML pages were removed (data-only mode requested). Regeneration of site output can be done externally with a static site generator consuming the JSON.

## Project Goals

- Provide clear navigation from Kingdom → Monarch → Detailed History.
- Keep content static, fast, and accessible (semantic HTML, responsive layout, WCAG-friendly structure).
- Enable future enhancements (client-side search, filtering, timeline visualizations) via a minimal JS layer.

## Data Schema

Two primary files will be introduced:

```text
data/
  kingdoms.json  # Array of kingdom objects
  kings.json     # Array of king objects
```

### kingdoms.json (schema)
```jsonc
{
  "id": "anuradhapura",        // slug identifier
  "name": "Anuradhapura",      // display name
  "era": "437 BCE – 1017 CE",  // inclusive date range
  "region": "North Central Province", // optional
  "notes": "First major kingdom; irrigation & Buddhist center"
}
```

### kings.json (schema)
```jsonc
{
  "name": "Dutugemunu",
  "slug": "dutugemunu",              // derived, lowercase kebab
  "kingdom": "anuradhapura",         // foreign key to kingdoms.id
  "reign": "161–137 BCE",            // original textual reign
  "startYear": -161,                  // negative for BCE (optional parse)
  "endYear": -137,                    // negative for BCE (optional parse)
  "categories": ["unification","architecture"], // tags
  "notes": "Unified much of Sri Lanka; major Buddhist works"
}
```

If years cannot be confidently parsed they will be omitted from `startYear`/`endYear` but the textual `reign` preserved.

## Content Roadmap (Data Mode)

- Populate `kingdoms.json` with all major kingdoms (Tambapanni, Upatissa Nuwara, Anuradhapura, Sigiriya phase, Polonnaruwa, Dambadeniya, Yapahuwa, Kurunegala, Gampola, Kotte, Sitawaka, Kandyan, Jaffna).
- Populate `kings.json` from provided chronological list.
- Add optional `sources` field per king for citations.
- Provide a script to validate referential integrity (kingdom slug existence).
- Publish versioned releases (e.g., `v0.1.0`) for downstream consumption.

## Contributing

1. Fork the repository.
2. Add or update entries in `data/kingdoms.json` or `data/kings.json` following schema.
3. Maintain alphabetical or chronological ordering as indicated in file header comments (to be added).
4. Include `sources` array when adding new historical assertions.
5. Run validation script (planned) before PR submission.

## Data Integrity & Sources

Primary narrative sources include the Mahavamsa, Culavamsa, archaeological survey reports, and peer-reviewed historiography. Pages will gradually incorporate citation footnotes to distinguish legend from corroborated history.

## Accessibility Guidelines

- Use `<caption>` for complex tables (planned addition).
- Provide descriptive link text (avoid "click here").
- Maintain color contrast (checked against WCAG AA).
- Keyboard focus states preserved.

## Future Automation

Static site generators or visualization layers can ingest these JSON files to produce timelines, maps, or multilingual interfaces. Tooling included: `scripts/validate.js` (referential integrity) and `scripts/export-markdown.js` (derives Markdown summaries). No HTML artifacts are kept in the repo.

## CLI Usage

Install locally (dev):
```bash
npm install
```

Run validation:
```bash
npm run validate
```

List kingdoms:
```bash
node src/cli.js list-kingdoms
```

List kings of Anuradhapura:
```bash
node src/cli.js list-kings anuradhapura
```

Find king by name fragment:
```bash
node src/cli.js find-king tissa
```

Export Markdown set:
```bash
npm run export:md
```

Global install (optional):
```bash
npm link
slhistory list-kingdoms
```

## License

Content is provided for educational purposes. (Formal license to be decided.)

---
© 2025 Sri Lanka History Wiki (Work in progress)
Maintained by Jules
