package api

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/NimuthuGanegoda/WorldHistoryArchive/internal/models"
	"github.com/NimuthuGanegoda/WorldHistoryArchive/internal/store"
)

// API encapsulates the REST API router and handlers.
type API struct {
	store *store.Store
}

// New creates a new API instance.
func New(s *store.Store) *API {
	return &API{store: s}
}

func (a *API) writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

// RegisterRoutes registers all API endpoints on standard ServeMux.
func (a *API) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/stats", a.HandleStats)
	mux.HandleFunc("GET /api/kings", a.HandleKings)
	mux.HandleFunc("GET /api/kings/{slug}", a.HandleKingBySlug)
	mux.HandleFunc("GET /api/daily", a.HandleDailyKings)
	mux.HandleFunc("GET /api/kingdoms", a.HandleKingdoms)
	mux.HandleFunc("GET /api/kingdoms/{slug}", a.HandleKingdomBySlug)
	mux.HandleFunc("GET /api/sites", a.HandleSites)
	mux.HandleFunc("GET /api/sites/{id}", a.HandleSiteByID)
	mux.HandleFunc("GET /api/countries", a.HandleCountries)
	mux.HandleFunc("GET /api/countries/{slug}", a.HandleCountryBySlug)
	mux.HandleFunc("GET /api/countries/{slug}/kingdoms", a.HandleCountryKingdoms)
	mux.HandleFunc("GET /api/countries/{slug}/kings", a.HandleCountryKings)
	mux.HandleFunc("GET /api/countries/{slug}/sites", a.HandleCountrySites)
	mux.HandleFunc("GET /api/timeline", a.HandleTimeline)
	mux.HandleFunc("GET /api/search", a.HandleSearch)
}

func (a *API) HandleStats(w http.ResponseWriter, r *http.Request) {
	a.writeJSON(w, http.StatusOK, a.store.GetStats())
}

func (a *API) HandleKings(w http.ResponseWriter, r *http.Request) {
	kingdom := r.URL.Query().Get("kingdom")
	country := r.URL.Query().Get("country")
	search := strings.ToLower(r.URL.Query().Get("search"))

	kings := a.store.GetKings()
	var filtered []models.King

	for _, k := range kings {
		if country != "" && !strings.EqualFold(k.CountrySlug, country) && !strings.EqualFold(k.Country, country) {
			continue
		}
		if kingdom != "" && !strings.EqualFold(k.KingdomSlug, kingdom) && !strings.EqualFold(k.Kingdom, kingdom) {
			continue
		}
		if search != "" && !strings.Contains(strings.ToLower(k.Title), search) && !strings.Contains(strings.ToLower(k.Biography), search) {
			continue
		}
		filtered = append(filtered, k)
	}

	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		if limit, err := strconv.Atoi(limitStr); err == nil && limit > 0 && limit < len(filtered) {
			filtered = filtered[:limit]
		}
	}

	a.writeJSON(w, http.StatusOK, filtered)
}

func (a *API) HandleKingBySlug(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	king, exists := a.store.GetKingBySlug(slug)
	if !exists {
		a.writeJSON(w, http.StatusNotFound, map[string]string{"error": "King not found"})
		return
	}
	a.writeJSON(w, http.StatusOK, king)
}

func (a *API) HandleDailyKings(w http.ResponseWriter, r *http.Request) {
	count := 6
	if countStr := r.URL.Query().Get("count"); countStr != "" {
		if parsed, err := strconv.Atoi(countStr); err == nil && parsed > 0 {
			count = parsed
		}
	}
	daily := a.store.GetDailyKings(count, time.Now())
	a.writeJSON(w, http.StatusOK, daily)
}

func (a *API) HandleKingdoms(w http.ResponseWriter, r *http.Request) {
	country := r.URL.Query().Get("country")
	if country != "" {
		cSlug := store.Slugify(country)
		a.writeJSON(w, http.StatusOK, a.store.GetKingdomsByCountry(cSlug))
		return
	}
	a.writeJSON(w, http.StatusOK, a.store.GetKingdoms())
}

func (a *API) HandleKingdomBySlug(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	kd, exists := a.store.GetKingdomBySlug(slug)
	if !exists {
		a.writeJSON(w, http.StatusNotFound, map[string]string{"error": "Kingdom not found"})
		return
	}
	a.writeJSON(w, http.StatusOK, kd)
}

func (a *API) HandleSites(w http.ResponseWriter, r *http.Request) {
	country := r.URL.Query().Get("country")
	kingdom := r.URL.Query().Get("kingdom")

	if country != "" {
		cSlug := store.Slugify(country)
		a.writeJSON(w, http.StatusOK, a.store.GetSitesByCountry(cSlug))
		return
	}
	if kingdom != "" {
		kSlug := store.Slugify(kingdom)
		a.writeJSON(w, http.StatusOK, a.store.GetSitesByKingdom(kSlug))
		return
	}
	a.writeJSON(w, http.StatusOK, a.store.GetSites())
}

func (a *API) HandleSiteByID(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	site, exists := a.store.GetSiteByID(id)
	if !exists {
		a.writeJSON(w, http.StatusNotFound, map[string]string{"error": "Site not found"})
		return
	}
	a.writeJSON(w, http.StatusOK, site)
}

func (a *API) HandleCountries(w http.ResponseWriter, r *http.Request) {
	a.writeJSON(w, http.StatusOK, a.store.GetCountries())
}

func (a *API) HandleCountryBySlug(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	country, exists := a.store.GetCountryBySlug(slug)
	if !exists {
		a.writeJSON(w, http.StatusNotFound, map[string]string{"error": "Country not found"})
		return
	}

	response := struct {
		models.Country
		Kingdoms []models.Kingdom `json:"kingdoms"`
		Kings    []models.King    `json:"kings"`
		Sites    []models.Site    `json:"sites"`
	}{
		Country:  country,
		Kingdoms: a.store.GetKingdomsByCountry(slug),
		Kings:    a.store.GetKingsByCountry(slug),
		Sites:    a.store.GetSitesByCountry(slug),
	}

	a.writeJSON(w, http.StatusOK, response)
}

func (a *API) HandleCountryKingdoms(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	a.writeJSON(w, http.StatusOK, a.store.GetKingdomsByCountry(slug))
}

func (a *API) HandleCountryKings(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	a.writeJSON(w, http.StatusOK, a.store.GetKingsByCountry(slug))
}

func (a *API) HandleCountrySites(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")
	a.writeJSON(w, http.StatusOK, a.store.GetSitesByCountry(slug))
}

func (a *API) HandleTimeline(w http.ResponseWriter, r *http.Request) {
	a.writeJSON(w, http.StatusOK, a.store.GetTimeline())
}

func (a *API) HandleSearch(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	results := a.store.Search(query)
	a.writeJSON(w, http.StatusOK, results)
}

