package ssg

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"

	"github.com/NimuthuGanegoda/WorldHistoryArchive/internal/store"
	"github.com/NimuthuGanegoda/WorldHistoryArchive/internal/web"
)

// Generator builds static HTML & JSON files for deployment.
type Generator struct {
	store  *store.Store
	server *web.Server
}

// New creates a new static site generator.
func New(s *store.Store, srv *web.Server) *Generator {
	return &Generator{
		store:  s,
		server: srv,
	}
}

// Build generates all static pages into outputDir.
func (g *Generator) Build(outputDir string) error {
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return fmt.Errorf("creating output directory: %w", err)
	}

	handler := g.server.Handler()

	// List of core static routes to pre-render
	routes := []string{
		"/",
		"/countries",
		"/kings",
		"/kingdoms",
		"/timeline",
		"/sites",
		"/map",
		"/about",
		// JSON APIs
		"/api/stats",
		"/api/kings",
		"/api/kingdoms",
		"/api/sites",
		"/api/countries",
		"/api/timeline",
		"/api/daily",
	}

	// Add dynamic detail routes for all countries, kings, kingdoms, sites
	for _, c := range g.store.GetCountries() {
		routes = append(routes, "/countries/"+c.Slug)
		routes = append(routes, "/api/countries/"+c.Slug)
	}
	for _, k := range g.store.GetKings() {
		routes = append(routes, "/kings/"+k.Slug)
		routes = append(routes, "/api/kings/"+k.Slug)
	}
	for _, kd := range g.store.GetKingdoms() {
		routes = append(routes, "/kingdoms/"+kd.Slug)
		routes = append(routes, "/api/kingdoms/"+kd.Slug)
	}
	for _, site := range g.store.GetSites() {
		routes = append(routes, "/sites/"+site.ID)
		routes = append(routes, "/api/sites/"+site.ID)
	}

	for _, route := range routes {
		req := httptest.NewRequest("GET", route, nil)
		rec := httptest.NewRecorder()
		handler.ServeHTTP(rec, req)

		if rec.Code != http.StatusOK {
			return fmt.Errorf("rendering %s failed with status %d", route, rec.Code)
		}

		var targetFile string
		if route == "/" {
			targetFile = filepath.Join(outputDir, "index.html")
		} else if isAPIRoute(route) {
			targetFile = filepath.Join(outputDir, route+".json")
		} else {
			targetFile = filepath.Join(outputDir, route, "index.html")
		}

		if err := os.MkdirAll(filepath.Dir(targetFile), 0755); err != nil {
			return fmt.Errorf("creating parent dir for %s: %w", targetFile, err)
		}

		if err := os.WriteFile(targetFile, rec.Body.Bytes(), 0644); err != nil {
			return fmt.Errorf("writing %s: %w", targetFile, err)
		}
	}

	// Write CNAME and .nojekyll for GitHub Pages
	_ = os.WriteFile(filepath.Join(outputDir, ".nojekyll"), []byte(""), 0644)
	if cname, err := os.ReadFile("CNAME"); err == nil {
		_ = os.WriteFile(filepath.Join(outputDir, "CNAME"), cname, 0644)
	}

	return nil
}

func isAPIRoute(route string) bool {
	return len(route) >= 4 && route[:4] == "/api"
}

// ExportMarkdown exports all records into structured Markdown files.
func (g *Generator) ExportMarkdown(outputDir string) error {
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return fmt.Errorf("creating output directory: %w", err)
	}

	// 1. Export Kingdoms index
	var kingdomIndex = "# 🏰 Historical Kingdoms\n\n"
	for _, kd := range g.store.GetKingdoms() {
		kingdomIndex += fmt.Sprintf("- **[%s](%s/index.md)** (%s) — %s\n", kd.Title, kd.Slug, kd.Reign, kd.Description)

		kdDir := filepath.Join(outputDir, kd.Slug)
		_ = os.MkdirAll(kdDir, 0755)

		var kdContent = fmt.Sprintf("# %s\n\n*Period: %s* • *Region: %s*\n\n%s\n\n## Monarchs\n\n", kd.Title, kd.Reign, kd.Country, kd.Description)
		_ = os.WriteFile(filepath.Join(kdDir, "index.md"), []byte(kdContent), 0644)
	}
	_ = os.WriteFile(filepath.Join(outputDir, "kingdoms.md"), []byte(kingdomIndex), 0644)

	// 2. Export Kings
	for _, k := range g.store.GetKings() {
		kdDir := filepath.Join(outputDir, k.Kingdom)
		_ = os.MkdirAll(kdDir, 0755)

		var kContent = fmt.Sprintf("# %s\n\n**Reign:** %s\n**Kingdom:** %s\n**Region:** %s\n\n## Biography\n\n%s\n",
			k.Title, k.Reign, k.Kingdom, k.Country, k.Biography)

		if k.InternationalConnections != "" {
			kContent += fmt.Sprintf("\n## International Connections\n\n%s\n", k.InternationalConnections)
		}

		_ = os.WriteFile(filepath.Join(kdDir, k.Slug+".md"), []byte(kContent), 0644)
	}

	// 3. Export Sites
	sitesDir := filepath.Join(outputDir, "sites")
	_ = os.MkdirAll(sitesDir, 0755)
	for _, site := range g.store.GetSites() {
		siteContent := fmt.Sprintf("# %s\n\n**Type:** %s\n**Kingdom:** %s\n**Period:** %s\n**Coordinates:** %f, %f\n\n## Description\n\n%s\n\n## History\n\n%s\n",
			site.Name, site.Type, site.Kingdom, site.Period, site.Coordinates.Lat, site.Coordinates.Lng, site.Description, site.History)
		_ = os.WriteFile(filepath.Join(sitesDir, site.ID+".md"), []byte(siteContent), 0644)
	}

	// 4. Export JSON dump
	stats := g.store.GetStats()
	statsBytes, _ := json.MarshalIndent(stats, "", "  ")
	_ = os.WriteFile(filepath.Join(outputDir, "stats.json"), statsBytes, 0644)

	return nil
}
