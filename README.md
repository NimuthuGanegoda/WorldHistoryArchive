# World History Archive

A Next.js web application dedicated to cataloging and visualizing the history of kingdoms, monarchs, and archaeological sites.

This project aims to provide an accessible, structured, and interactive way to explore the world's rich historical timeline, with an initial focus on Sri Lankan history.

## Key Features

- **Interactive Map**: Visualize the geographical distribution of kingdoms and sites.
- **Timeline Visualization**: Explore a chronological view of rulers and major events.
- **Interactive Exploration**: Navigate easily from Kingdom to Monarch to specific historical details.
- **Structured Data**: Utilize a robust JSON schema to ensure historical data is consistent and machine-readable.
- **Performance & Accessibility**: Built with Next.js and Tailwind CSS for a fast, responsive, and accessible user experience.
- **Educational Resource**: Serve as a reliable reference for students, historians, and enthusiasts.

## Architecture & Data

The website is powered by static JSON data located in `src/data/`. This separation of data and UI allows for easy updates and potential reuse of the dataset.

Key data files:
- `src/data/kingdoms.json`: Definitions of major historical kingdoms (e.g., Anuradhapura, Polonnaruwa).
- `src/data/kings.json`: Detailed records of monarchs, including reigns, biographies, and connections.
- `src/data/sites.json`: Archaeological sites and their historical context.

*Note: The root `data/` directory contains source/legacy datasets and is used by some utility scripts.*

## Daily Featured Kings

The "Featured Rulers" section on the homepage automatically updates every day at **Sri Lanka Standard Time (UTC+5:30) midnight**.

- **Mechanism**: A deterministic shuffling algorithm (seeded by the date in Asia/Colombo timezone) selects 6 random kings each day.
- **Consistency**: All users see the same set of kings on any given day (according to Sri Lanka time), ensuring alignment with the historical context.
- **Updates**:
  - The static site is rebuilt daily via GitHub Actions (cron: `0 19 * * *`) to bake the new daily kings into the HTML for SEO and initial load. Note: 19:00 UTC (00:30 SLST) ensures the update happens strictly after midnight in Sri Lanka.
  - The client-side component (`FeaturedKings`) also checks the date and updates the list dynamically if the cached HTML is stale (e.g., if a user keeps the tab open across midnight).

To verify the rotation logic locally, you can use the test command:
```bash
npm test
```

## Getting Started

To run the application locally:

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the site.

3.  **Build for Production**
    ```bash
    npm run build
    ```
    *Note: `npm start` will not work because the project uses static export (`output: 'export'`). To test the production build locally, run:*
    ```bash
    python3 -m http.server out
    # or
    npx serve out
    ```

## Contributing

We welcome contributions to improve the data accuracy or website features.

1.  **Fork the repository.**
2.  **Update Data**:
    - Edit files in `src/data/` to add or correct historical information.
    - Ensure you follow the existing schema structure.
3.  **Validate**: Run the validation script to check for data integrity.
    ```bash
    npm run validate
    ```
4.  **Submit a Pull Request**.

## Utilities & CLI

The project includes utility scripts in `src/cli.js` and `scripts/` to help manage the data.

- **Validate Data**: `npm run validate`
- **Export Markdown**: `npm run export:md`
- **Check Google Fonts**: `node scripts/check-no-google-fonts.js` (Ensures no Google Fonts are imported)
- **Verify Rotation**: `node scripts/verify-rotation.js` (Verifies the daily featured kings rotation logic)
- **CLI Tools**:
    ```bash
    # List kingdoms
    node src/cli.js list-kingdoms

    # Find a king
    node src/cli.js find-king <name>
    ```

## License

Content is provided for educational purposes.

---
© 2025 World History Archive
