# 🏛️ World History Archive

[![Deploy Next.js to GitHub Pages](https://github.com/NimuthuGanegoda/WorldHistoryArchive/actions/workflows/nextjs.yml/badge.svg)](https://github.com/NimuthuGanegoda/WorldHistoryArchive/actions/workflows/nextjs.yml)
![Status](https://img.shields.io/badge/Status-Operational-success?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-Go_1.22_%26_Next.js-00ADD8?style=flat-square&logo=go)
![Data](https://img.shields.io/badge/Data-JSON_Powered-FFD700?style=flat-square&logo=json)

**World History Archive** is a high-performance knowledge platform and CLI engineered in **Go (Golang)** to preserve and visualize the complex narratives of human civilization. Leveraging an in-memory indexed store, sub-millisecond REST APIs, spatial mapping, and deterministic Static Site Generation (SSG), it provides an elite research environment for exploring kingdoms, monarchs, and archaeological sites.

---

## 🌟 Core Features

*   **⚡ Native Go Architecture**: Zero-dependency, sub-millisecond query engine and HTTP server.
*   **🌍 Spatial Intelligence**: Interactive geographic visualizations mapping the territories of ancient empires and sites.
*   **⏳ Dynastic Timelines**: Precision-indexed chronological records of over 190 rulers across 18+ kingdoms.
*   **📅 Daily Spotlight**: Automated daily rotation of featured historical figures seeded by localized timezones.
*   **🔒 Hardened Static Architecture**: Native SSG export for deterministic builds and static GitHub Pages hosting.
*   **💻 Unified CLI Tool**: Full terminal suite for search, validation, Markdown export, and live serving.

---

## 🏗️ Ecosystem & Heritage

The World History Archive is part of a broader architectural vision and is supported by several sister repositories within the sanctuary:

| Project | Role |
| :--- | :--- |
| 🛡️ **[Sovereign Core](https://github.com/NimuthuGanegoda/Sanctuary-of-Eternity)** | Foundational security policies and architectural guidance. |
| 👤 **[Nimuthu Ganegoda](https://github.com/NimuthuGanegoda)** | Project Architect and Lead Maintainer. |
| 🗺️ **[Leaflet](https://leafletjs.com/)** | Core mapping engine for spatial data visualization. |
| ⚙️ **[Archive CLI (`wha`)](cmd/wha/)** | Native Go command-line tool, server, and static generator. |

---

## 📚 Technical Documentation

| Documentation | Description |
| :--- | :--- |
| 📖 **[Deployment Handbook](DEPLOYMENT.md)** | CI/CD pipeline and static export configuration. |
| 🛠️ **[Update Guide](UPDATE_GUIDE.md)** | Instructions for maintaining JSON datasets. |
| 🛡️ **[Security Policy](SECURITY.md)** | Data integrity and platform hardening standards. |
| ✅ **[Setup Verification](SETUP_COMPLETE.md)** | Final validation report of the automated environment. |

---

## 🛠️ Development Operations (Go Edition)

### Build Binary
```bash
make build
# or: go build -o wha ./cmd/wha
```

### Start Live Server
```bash
make serve
# or: ./wha serve --port 8080
```
Open **`http://localhost:8080`** in your browser.

### Generate Static Site (SSG)
```bash
make ssg
# or: ./wha build --out dist
```

### Run Tests & Validation
```bash
make test
./wha validate
```

### Terminal CLI Commands
```bash
./wha spotlight               # View today's featured monarchs
./wha search "Dutugemunu"     # Instant terminal search across archive
./wha export-md --out docs    # Export full archive to Markdown files
./wha stats                   # View dataset metrics
```

---

## 🤝 Contribution Protocol

We welcome data-driven contributions that enhance the depth and accuracy of the archive.
1. Fork the repository.
2. Update records in `src/data/`.
3. Validate data integrity: `npm run validate`.
4. Submit a detailed pull request.

---

**Developed by Nimuthu Ganegoda | World History Archive | 2026**
