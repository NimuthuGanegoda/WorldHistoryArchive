# 🏛️ World History Archive

[![Deploy Next.js to GitHub Pages](https://github.com/NimuthuGanegoda/WorldHistoryArchive/actions/workflows/nextjs.yml/badge.svg)](https://github.com/NimuthuGanegoda/WorldHistoryArchive/actions/workflows/nextjs.yml)
![Status](https://img.shields.io/badge/Status-Operational-success?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-Next.js_15-0070f3?style=flat-square&logo=next.js)
![Data](https://img.shields.io/badge/Data-JSON_Powered-FFD700?style=flat-square&logo=json)

**World History Archive** is a high-performance, static Next.js knowledge platform engineered to preserve and visualize the complex narratives of human civilization. Leveraging a map-first approach and chronological timeline integration, it provides an elite research environment for exploring kingdoms, monarchs, and archaeological sites.

---

## 🌟 Core Features

*   **🌍 Spatial Intelligence**: Interactive geographic visualizations mapping the territories of ancient empires and sites.
*   **⏳ Dynastic Timelines**: Precision-indexed chronological records of over 190 rulers across 16+ kingdoms.
*   **📅 Daily Spotlight**: Automated daily rotation of featured historical figures seeded by localized timezones.
*   **🔒 Hardened Static Architecture**: Fully decoupled JSON data layer for deterministic builds and ultra-fast delivery.
*   **📱 Modern UX**: A refined, responsive interface optimized for academic research and casual exploration.

---

## 🏗️ Ecosystem & Heritage

The World History Archive is part of a broader architectural vision and is supported by several sister repositories within the sanctuary:

| Project | Role |
| :--- | :--- |
| 🛡️ **[Sovereign Core](https://github.com/NimuthuGanegoda/Sanctuary-of-Eternity)** | Foundational security policies and architectural guidance. |
| 👤 **[Nimuthu Ganegoda](https://github.com/NimuthuGanegoda)** | Project Architect and Lead Maintainer. |
| 🗺️ **[Leaflet](https://leafletjs.com/)** | Core mapping engine for spatial data visualization. |
| ⚙️ **[Archive Scripts](scripts/)** | Automated data enrichment and validation tools. |

---

## 📚 Technical Documentation

| Documentation | Description |
| :--- | :--- |
| 📖 **[Deployment Handbook](DEPLOYMENT.md)** | CI/CD pipeline and static export configuration. |
| 🛠️ **[Update Guide](UPDATE_GUIDE.md)** | Instructions for maintaining JSON datasets. |
| 🛡️ **[Security Policy](SECURITY.md)** | Data integrity and platform hardening standards. |
| ✅ **[Setup Verification](SETUP_COMPLETE.md)** | Final validation report of the automated environment. |

---

## 🛠️ Development Operations

### Environment Setup
```bash
npm install
```

### Local Development
```bash
npm run dev
```

### Build & Static Export
```bash
npm run build
```

The platform is automatically deployed to **[srilankanhistory.dev](https://srilankanhistory.dev/)** via GitHub Actions upon every validated commit to the `main` branch.

---

## 🤝 Contribution Protocol

We welcome data-driven contributions that enhance the depth and accuracy of the archive.
1. Fork the repository.
2. Update records in `src/data/`.
3. Validate data integrity: `npm run validate`.
4. Submit a detailed pull request.

---

**Developed by Nimuthu Ganegoda | World History Archive | 2026**
