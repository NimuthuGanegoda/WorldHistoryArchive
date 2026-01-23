# Sri Lanka History Wiki

A Next.js web application dedicated to cataloging and visualizing the history of Sri Lankan kingdoms, monarchs, and archaeological sites.

This project aims to provide an accessible, structured, and interactive way to explore Sri Lanka's rich historical timeline, moving beyond static text to a data-driven experience.

## Website Goals

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
© 2025 Sri Lanka History Wiki
