package web

import (
	"embed"
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"strings"
	"time"

	"github.com/NimuthuGanegoda/WorldHistoryArchive/internal/api"
	"github.com/NimuthuGanegoda/WorldHistoryArchive/internal/models"
	"github.com/NimuthuGanegoda/WorldHistoryArchive/internal/store"
)

//go:embed templates/*
var templateFS embed.FS

// Server represents the web application server.
type Server struct {
	store     *store.Store
	api       *api.API
	templates map[string]*template.Template
}

// NewServer initializes templates and returns a new Server instance.
func NewServer(s *store.Store) (*Server, error) {
	srv := &Server{
		store:     s,
		api:       api.New(s),
		templates: make(map[string]*template.Template),
	}

	pages := []string{
		"home.html",
		"countries.html",
		"country_detail.html",
		"kings.html",
		"king_detail.html",
		"kingdoms.html",
		"kingdom_detail.html",
		"timeline.html",
		"sites.html",
		"site_detail.html",
		"map.html",
		"about.html",
	}

	for _, page := range pages {
		tmpl, err := template.ParseFS(templateFS, "templates/layout.html", "templates/"+page)
		if err != nil {
			return nil, fmt.Errorf("parsing template %s: %w", page, err)
		}
		srv.templates[page] = tmpl
	}

	return srv, nil
}

// Handler returns the root http.Handler with all UI and API routes configured.
func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()

	// 1. Register API Routes
	s.api.RegisterRoutes(mux)

	// 2. Register Web Pages
	mux.HandleFunc("GET /{$}", s.handleHome)
	mux.HandleFunc("GET /countries", s.handleCountries)
	mux.HandleFunc("GET /countries/{slug}", s.handleCountryDetail)
	mux.HandleFunc("GET /kings", s.handleKings)
	mux.HandleFunc("GET /kings/{slug}", s.handleKingDetail)
	mux.HandleFunc("GET /kingdoms", s.handleKingdoms)
	mux.HandleFunc("GET /kingdoms/{slug}", s.handleKingdomDetail)
	mux.HandleFunc("GET /timeline", s.handleTimeline)
	mux.HandleFunc("GET /sites", s.handleSites)
	mux.HandleFunc("GET /sites/{id}", s.handleSiteDetail)
	mux.HandleFunc("GET /map", s.handleMap)
	mux.HandleFunc("GET /about", s.handleAbout)

	// Middleware for logging & CORS
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		mux.ServeHTTP(w, r)
		_ = start
	})
}

func (s *Server) render(w http.ResponseWriter, page string, data interface{}) {
	tmpl, ok := s.templates[page]
	if !ok {
		http.Error(w, "Template not found: "+page, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := tmpl.ExecuteTemplate(w, "base", data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func (s *Server) handleHome(w http.ResponseWriter, r *http.Request) {
	countriesJSON, _ := json.Marshal(s.store.GetCountries())
	sitesJSON, _ := json.Marshal(s.store.GetSites())
	data := struct {
		Title         string
		Description   string
		Stats         models.ArchiveStats
		DailyKings    []models.King
		Kingdoms      []models.Kingdom
		Countries     []models.Country
		CountriesJSON string
		SitesJSON     string
	}{
		Title:         "Home - Chronicle of Civilizations",
		Description:   "Explore the monarchs, kingdoms, and archaeological monuments of human history.",
		Stats:         s.store.GetStats(),
		DailyKings:    s.store.GetDailyKings(6, time.Now()),
		Kingdoms:      s.store.GetKingdoms(),
		Countries:     s.store.GetCountries(),
		CountriesJSON: string(countriesJSON),
		SitesJSON:     string(sitesJSON),
	}
	s.render(w, "home.html", data)
}

func (s *Server) handleCountries(w http.ResponseWriter, r *http.Request) {
	data := struct {
		Title       string
		Description string
		Countries   []models.Country
		Stats       models.ArchiveStats
	}{
		Title:       "World Civilizations & Empires",
		Description: "Explore the principal historical civilizations, empires, and territorial realms.",
		Countries:   s.store.GetCountries(),
		Stats:       s.store.GetStats(),
	}
	s.render(w, "countries.html", data)
}

func (s *Server) handleCountryDetail(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	country, exists := s.store.GetCountryBySlug(slug)
	if !exists {
		http.NotFound(w, r)
		return
	}

	data := struct {
		Title       string
		Description string
		Country     models.Country
		Kingdoms    []models.Kingdom
		Kings       []models.King
		Sites       []models.Site
	}{
		Title:       country.Name + " - Historical Chronicle",
		Description: country.Description,
		Country:     country,
		Kingdoms:    s.store.GetKingdomsByCountry(slug),
		Kings:       s.store.GetKingsByCountry(slug),
		Sites:       s.store.GetSitesByCountry(slug),
	}
	s.render(w, "country_detail.html", data)
}

func (s *Server) handleKings(w http.ResponseWriter, r *http.Request) {
	kingdom := r.URL.Query().Get("kingdom")
	country := r.URL.Query().Get("country")
	query := r.URL.Query().Get("search")

	allKings := s.store.GetKings()
	var filtered []models.King
	for _, k := range allKings {
		if country != "" && !strings.EqualFold(k.CountrySlug, country) && !strings.EqualFold(k.Country, country) {
			continue
		}
		if kingdom != "" && !strings.EqualFold(k.KingdomSlug, kingdom) && !strings.EqualFold(k.Kingdom, kingdom) {
			continue
		}
		if query != "" && !strings.Contains(strings.ToLower(k.Title), strings.ToLower(query)) && !strings.Contains(strings.ToLower(k.Biography), strings.ToLower(query)) {
			continue
		}
		filtered = append(filtered, k)
	}

	data := struct {
		Title           string
		Description     string
		Kings           []models.King
		Kingdoms        []models.Kingdom
		Countries       []models.Country
		SelectedKingdom string
		SelectedCountry string
		Query           string
	}{
		Title:           "Monarchs & Rulers",
		Description:     "Chronological catalog of recorded historical rulers.",
		Kings:           filtered,
		Kingdoms:        s.store.GetKingdoms(),
		Countries:       s.store.GetCountries(),
		SelectedKingdom: kingdom,
		SelectedCountry: country,
		Query:           query,
	}
	s.render(w, "kings.html", data)
}

func (s *Server) handleKingDetail(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	king, exists := s.store.GetKingBySlug(slug)
	if !exists {
		http.NotFound(w, r)
		return
	}

	data := struct {
		Title       string
		Description string
		King        models.King
	}{
		Title:       king.Title,
		Description: fmt.Sprintf("Historical record and biography of %s (%s).", king.Title, king.Reign),
		King:        king,
	}
	s.render(w, "king_detail.html", data)
}

func (s *Server) handleKingdoms(w http.ResponseWriter, r *http.Request) {
	country := r.URL.Query().Get("country")
	var kds []models.Kingdom
	if country != "" {
		cSlug := store.Slugify(country)
		kds = s.store.GetKingdomsByCountry(cSlug)
	} else {
		kds = s.store.GetKingdoms()
	}

	data := struct {
		Title           string
		Description     string
		Kingdoms        []models.Kingdom
		Countries       []models.Country
		SelectedCountry string
	}{
		Title:           "Historical Dynasties & Eras",
		Description:     "Ancient sovereign realms and dynastic eras.",
		Kingdoms:        kds,
		Countries:       s.store.GetCountries(),
		SelectedCountry: country,
	}
	s.render(w, "kingdoms.html", data)
}

func (s *Server) handleKingdomDetail(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	kd, exists := s.store.GetKingdomBySlug(slug)
	if !exists {
		http.NotFound(w, r)
		return
	}

	rulers := s.store.GetKingsByKingdom(slug)
	sites := s.store.GetSitesByKingdom(slug)

	data := struct {
		Title       string
		Description string
		Kingdom     models.Kingdom
		Kings       []models.King
		Sites       []models.Site
	}{
		Title:       kd.Title,
		Description: fmt.Sprintf("History and monarchs of %s (%s).", kd.Title, kd.Reign),
		Kingdom:     kd,
		Kings:       rulers,
		Sites:       sites,
	}
	s.render(w, "kingdom_detail.html", data)
}

func (s *Server) handleTimeline(w http.ResponseWriter, r *http.Request) {
	data := struct {
		Title       string
		Description string
		Entries     []models.TimelineEntry
	}{
		Title:       "Historical Timeline",
		Description: "Chronological progression of monarchs and dynasties.",
		Entries:     s.store.GetTimeline(),
	}
	s.render(w, "timeline.html", data)
}

func (s *Server) handleSites(w http.ResponseWriter, r *http.Request) {
	country := r.URL.Query().Get("country")
	kingdom := r.URL.Query().Get("kingdom")

	var sites []models.Site
	if country != "" {
		cSlug := store.Slugify(country)
		sites = s.store.GetSitesByCountry(cSlug)
	} else if kingdom != "" {
		kSlug := store.Slugify(kingdom)
		sites = s.store.GetSitesByKingdom(kSlug)
	} else {
		sites = s.store.GetSites()
	}

	data := struct {
		Title           string
		Description     string
		Sites           []models.Site
		Countries       []models.Country
		SelectedCountry string
	}{
		Title:           "Archaeological Sites",
		Description:     "Monuments, stupas, fortresses, and ancient engineering sites.",
		Sites:           sites,
		Countries:       s.store.GetCountries(),
		SelectedCountry: country,
	}
	s.render(w, "sites.html", data)
}

func (s *Server) handleSiteDetail(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	site, exists := s.store.GetSiteByID(id)
	if !exists {
		http.NotFound(w, r)
		return
	}

	data := struct {
		Title       string
		Description string
		Site        models.Site
	}{
		Title:       site.Name,
		Description: site.Description,
		Site:        site,
	}
	s.render(w, "site_detail.html", data)
}

func (s *Server) handleMap(w http.ResponseWriter, r *http.Request) {
	countriesJSON, _ := json.Marshal(s.store.GetCountries())
	sitesJSON, _ := json.Marshal(s.store.GetSites())
	data := struct {
		Title         string
		Description   string
		Countries     []models.Country
		Sites         []models.Site
		CountriesJSON string
		SitesJSON     string
	}{
		Title:         "Spatial Cartography & Map",
		Description:   "Interactive map of archaeological sites across civilizations.",
		Countries:     s.store.GetCountries(),
		Sites:         s.store.GetSites(),
		CountriesJSON: string(countriesJSON),
		SitesJSON:     string(sitesJSON),
	}
	s.render(w, "map.html", data)
}

func (s *Server) handleAbout(w http.ResponseWriter, r *http.Request) {
	data := struct {
		Title       string
		Description string
		Stats       models.ArchiveStats
	}{
		Title:       "About the Archive",
		Description: "Mission, architecture, and technology behind World History Archive.",
		Stats:       s.store.GetStats(),
	}
	s.render(w, "about.html", data)
}

