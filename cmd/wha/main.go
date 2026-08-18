package main

import (
	"embed"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/NimuthuGanegoda/WorldHistoryArchive/internal/ssg"
	"github.com/NimuthuGanegoda/WorldHistoryArchive/internal/store"
	"github.com/NimuthuGanegoda/WorldHistoryArchive/internal/web"
)

//go:embed data/*.json
var embeddedData embed.FS

const version = "1.0.0 (Go Edition)"

func main() {
	if len(os.Args) < 2 {
		printHelp()
		os.Exit(0)
	}

	command := os.Args[1]

	switch command {
	case "serve":
		serveCmd(os.Args[2:])
	case "build":
		buildCmd(os.Args[2:])
	case "validate":
		validateCmd(os.Args[2:])
	case "search":
		searchCmd(os.Args[2:])
	case "spotlight":
		spotlightCmd(os.Args[2:])
	case "export-md":
		exportMDCmd(os.Args[2:])
	case "stats":
		statsCmd(os.Args[2:])
	case "version", "-v", "--version":
		fmt.Printf("World History Archive CLI %s\n", version)
	case "help", "-h", "--help":
		printHelp()
	default:
		fmt.Fprintf(os.Stderr, "Unknown command: %s\nRun 'wha help' for usage.\n", command)
		os.Exit(1)
	}
}

func initStore(dataDir string) (*store.Store, error) {
	st := store.New()

	if dataDir != "" {
		if err := st.LoadFromDir(dataDir); err != nil {
			return nil, fmt.Errorf("loading data from directory %s: %w", dataDir, err)
		}
		return st, nil
	}

	// Try reading from embedded filesystem
	kingsJSON, err1 := embeddedData.ReadFile("data/kings.json")
	kingdomsJSON, err2 := embeddedData.ReadFile("data/kingdoms.json")
	sitesJSON, err3 := embeddedData.ReadFile("data/sites.json")
	countriesJSON, err4 := embeddedData.ReadFile("data/countries.json")

	if err1 == nil && err2 == nil && err3 == nil && err4 == nil {
		if err := st.LoadFromBytes(kingsJSON, kingdomsJSON, sitesJSON, countriesJSON); err == nil {
			return st, nil
		}
	}

	// Fallback to local data/ directory
	if err := st.LoadFromDir("data"); err != nil {
		if err2 := st.LoadFromDir("src/data"); err2 != nil {
			return nil, fmt.Errorf("could not load historical data: %w (fallback: %v)", err, err2)
		}
	}
	return st, nil
}

func serveCmd(args []string) {
	fs := flag.NewFlagSet("serve", flag.ExitOnError)
	port := fs.Int("port", 8080, "Port for the HTTP server")
	host := fs.String("host", "0.0.0.0", "Host address to bind to")
	dataDir := fs.String("data", "", "Path to data directory (defaults to embedded data)")
	_ = fs.Parse(args)

	st, err := initStore(*dataDir)
	if err != nil {
		log.Fatalf("Error loading store: %v", err)
	}

	server, err := web.NewServer(st)
	if err != nil {
		log.Fatalf("Error initializing server: %v", err)
	}

	stats := st.GetStats()
	addr := fmt.Sprintf("%s:%d", *host, *port)
	fmt.Printf("\n🏛️  World History Archive Server %s\n", version)
	fmt.Printf("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
	fmt.Printf("• Database:   %d Kings | %d Kingdoms | %d Sites\n", stats.TotalKings, stats.TotalKingdoms, stats.TotalSites)
	fmt.Printf("• Interface:  http://localhost:%d\n", *port)
	fmt.Printf("• REST API:   http://localhost:%d/api/kings\n", *port)
	fmt.Printf("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n")

	if err := http.ListenAndServe(addr, server.Handler()); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

func buildCmd(args []string) {
	fs := flag.NewFlagSet("build", flag.ExitOnError)
	outDir := fs.String("out", "dist", "Output directory for static site generation")
	dataDir := fs.String("data", "", "Path to data directory")
	_ = fs.Parse(args)

	st, err := initStore(*dataDir)
	if err != nil {
		log.Fatalf("Error loading store: %v", err)
	}

	server, err := web.NewServer(st)
	if err != nil {
		log.Fatalf("Error initializing server: %v", err)
	}

	generator := ssg.New(st, server)
	fmt.Printf("Building static distribution to '%s'...\n", *outDir)
	start := time.Now()

	if err := generator.Build(*outDir); err != nil {
		log.Fatalf("Static build failed: %v", err)
	}

	stats := st.GetStats()
	fmt.Printf("✅ Static build completed in %v\n", time.Since(start))
	fmt.Printf("   Generated %d monarchs, %d kingdoms, and %d site profiles.\n", stats.TotalKings, stats.TotalKingdoms, stats.TotalSites)
}

func validateCmd(args []string) {
	fs := flag.NewFlagSet("validate", flag.ExitOnError)
	dataDir := fs.String("data", "", "Path to data directory")
	_ = fs.Parse(args)

	st, err := initStore(*dataDir)
	if err != nil {
		log.Fatalf("❌ Error loading dataset: %v", err)
	}

	errs := st.Validate()
	if len(errs) > 0 {
		fmt.Printf("❌ Validation Failed with %d errors:\n", len(errs))
		for _, e := range errs {
			fmt.Printf("  • %s\n", e)
		}
		os.Exit(1)
	}

	stats := st.GetStats()
	fmt.Printf("✅ Validation PASSED!\n")
	fmt.Printf("   All %d kings, %d kingdoms, and %d sites have valid schema constraints.\n",
		stats.TotalKings, stats.TotalKingdoms, stats.TotalSites)
}

func searchCmd(args []string) {
	if len(args) == 0 {
		fmt.Println("Usage: wha search <query>")
		os.Exit(1)
	}
	query := args[0]

	st, err := initStore("")
	if err != nil {
		log.Fatalf("Error loading dataset: %v", err)
	}

	results := st.Search(query)
	if len(results) == 0 {
		fmt.Printf("No matching records found for '%s'.\n", query)
		return
	}

	fmt.Printf("Found %d results for '%s':\n\n", len(results), query)
	for _, r := range results {
		fmt.Printf("• [%s] %s\n  %s\n  URL: %s\n\n", r.Type, r.Title, r.Subtitle, r.URL)
	}
}

func spotlightCmd(args []string) {
	st, err := initStore("")
	if err != nil {
		log.Fatalf("Error loading dataset: %v", err)
	}

	daily := st.GetDailyKings(6, time.Now())
	fmt.Printf("✨ Today's Featured Monarchs (Sri Lanka Standard Time):\n\n")
	for i, k := range daily {
		fmt.Printf("%d. %s (%s) — %s Kingdom\n   %s\n\n", i+1, k.Title, k.Reign, k.Kingdom, k.Biography[:min(140, len(k.Biography))]+"...")
	}
}

func exportMDCmd(args []string) {
	fs := flag.NewFlagSet("export-md", flag.ExitOnError)
	outDir := fs.String("out", "output-md", "Output directory for Markdown archive")
	dataDir := fs.String("data", "", "Path to data directory")
	_ = fs.Parse(args)

	st, err := initStore(*dataDir)
	if err != nil {
		log.Fatalf("Error loading store: %v", err)
	}

	server, err := web.NewServer(st)
	if err != nil {
		log.Fatalf("Error initializing server: %v", err)
	}

	generator := ssg.New(st, server)
	if err := generator.ExportMarkdown(*outDir); err != nil {
		log.Fatalf("Export failed: %v", err)
	}
	fmt.Printf("✅ Exported full historical archive in Markdown to '%s'\n", *outDir)
}

func statsCmd(args []string) {
	st, err := initStore("")
	if err != nil {
		log.Fatalf("Error loading dataset: %v", err)
	}

	stats := st.GetStats()
	fmt.Printf("🏛️  World History Archive Summary:\n")
	fmt.Printf("  • Monarchs:      %d\n", stats.TotalKings)
	fmt.Printf("  • Kingdoms:      %d\n", stats.TotalKingdoms)
	fmt.Printf("  • Ancient Sites: %d\n", stats.TotalSites)
	fmt.Printf("  • Countries:     %d\n", stats.TotalCountries)
}

func printHelp() {
	fmt.Printf(`🏛️  World History Archive CLI (Go Edition)

USAGE:
  wha <command> [arguments]

COMMANDS:
  serve       Start the live Web & REST API server
  build       Generate a static website distribution (SSG) for GitHub Pages
  validate    Validate JSON datasets for referential integrity
  search      Search monarchs, kingdoms, and sites from terminal
  spotlight   Display today's rotating featured monarchs
  export-md   Export datasets to structured Markdown documentation
  stats       Print archive summary analytics
  version     Print version information
  help        Show this help message

EXAMPLES:
  wha serve --port 8080
  wha build --out dist
  wha search "Dutugemunu"
  wha validate
`)
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
