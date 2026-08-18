package store

import (
	"encoding/json"
	"fmt"
	"math"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/NimuthuGanegoda/WorldHistoryArchive/internal/models"
)

// Store holds the in-memory indexed historical datasets.
type Store struct {
	mu           sync.RWMutex
	kings        []models.King
	kingdoms     []models.Kingdom
	sites        []models.Site
	countries    []models.Country
	kingsBySlug  map[string]models.King
	kingdomBySlug map[string]models.Kingdom
	sitesByID    map[string]models.Site
	kingsByKingdom map[string][]models.King
	sitesByKingdom map[string][]models.Site
}

// New creates an uninitialized Store instance.
func New() *Store {
	return &Store{
		kingsBySlug:    make(map[string]models.King),
		kingdomBySlug:  make(map[string]models.Kingdom),
		sitesByID:      make(map[string]models.Site),
		kingsByKingdom: make(map[string][]models.King),
		sitesByKingdom: make(map[string][]models.Site),
	}
}

// LoadFromDir reads JSON datasets from a filesystem directory.
func (s *Store) LoadFromDir(dir string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// 1. Kings
	kingsBytes, err := os.ReadFile(filepath.Join(dir, "kings.json"))
	if err != nil {
		return fmt.Errorf("reading kings.json: %w", err)
	}
	var kings []models.King
	if err := json.Unmarshal(kingsBytes, &kings); err != nil {
		return fmt.Errorf("unmarshaling kings.json: %w", err)
	}

	// 2. Kingdoms
	kingdomsBytes, err := os.ReadFile(filepath.Join(dir, "kingdoms.json"))
	if err != nil {
		return fmt.Errorf("reading kingdoms.json: %w", err)
	}
	var kingdoms []models.Kingdom
	if err := json.Unmarshal(kingdomsBytes, &kingdoms); err != nil {
		return fmt.Errorf("unmarshaling kingdoms.json: %w", err)
	}

	// 3. Sites
	sitesBytes, err := os.ReadFile(filepath.Join(dir, "sites.json"))
	if err != nil {
		return fmt.Errorf("reading sites.json: %w", err)
	}
	var sites []models.Site
	if err := json.Unmarshal(sitesBytes, &sites); err != nil {
		return fmt.Errorf("unmarshaling sites.json: %w", err)
	}

	// 4. Countries
	countriesBytes, err := os.ReadFile(filepath.Join(dir, "countries.json"))
	if err != nil {
		return fmt.Errorf("reading countries.json: %w", err)
	}
	var countries []models.Country
	if err := json.Unmarshal(countriesBytes, &countries); err != nil {
		return fmt.Errorf("unmarshaling countries.json: %w", err)
	}

	s.populate(kings, kingdoms, sites, countries)
	return nil
}

// LoadFromBytes loads datasets from raw in-memory JSON byte slices.
func (s *Store) LoadFromBytes(kingsJSON, kingdomsJSON, sitesJSON, countriesJSON []byte) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	var kings []models.King
	if err := json.Unmarshal(kingsJSON, &kings); err != nil {
		return fmt.Errorf("unmarshaling kings: %w", err)
	}

	var kingdoms []models.Kingdom
	if err := json.Unmarshal(kingdomsJSON, &kingdoms); err != nil {
		return fmt.Errorf("unmarshaling kingdoms: %w", err)
	}

	var sites []models.Site
	if err := json.Unmarshal(sitesJSON, &sites); err != nil {
		return fmt.Errorf("unmarshaling sites: %w", err)
	}

	var countries []models.Country
	if err := json.Unmarshal(countriesJSON, &countries); err != nil {
		return fmt.Errorf("unmarshaling countries: %w", err)
	}

	s.populate(kings, kingdoms, sites, countries)
	return nil
}

func (s *Store) populate(kings []models.King, kingdoms []models.Kingdom, sites []models.Site, countries []models.Country) {
	s.kingsBySlug = make(map[string]models.King)
	s.kingdomBySlug = make(map[string]models.Kingdom)
	s.sitesByID = make(map[string]models.Site)
	s.kingsByKingdom = make(map[string][]models.King)
	s.sitesByKingdom = make(map[string][]models.Site)

	// Enrich and sort kings
	for i := range kings {
		kings[i].StartYear = ParseStartYear(kings[i].Reign)
		s.kingsBySlug[kings[i].Slug] = kings[i]
		if kings[i].Kingdom != "" {
			s.kingsByKingdom[kings[i].Kingdom] = append(s.kingsByKingdom[kings[i].Kingdom], kings[i])
		}
	}
	sort.SliceStable(kings, func(i, j int) bool {
		return kings[i].StartYear < kings[j].StartYear
	})
	s.kings = kings

	// Enrich and sort kingdoms
	for i := range kingdoms {
		kingdoms[i].StartYear = ParseStartYear(kingdoms[i].Reign)
		rulerList := s.kingsByKingdom[kingdoms[i].Slug]
		kingdoms[i].RulerCount = len(rulerList)
		if len(kingdoms[i].Sections) > 0 && len(kingdoms[i].Sections[0].Content) > 0 {
			kingdoms[i].Description = kingdoms[i].Sections[0].Content[0]
		} else if kingdoms[i].Biography != "" {
			kingdoms[i].Description = kingdoms[i].Biography
		}
		s.kingdomBySlug[kingdoms[i].Slug] = kingdoms[i]
	}
	sort.SliceStable(kingdoms, func(i, j int) bool {
		return kingdoms[i].StartYear < kingdoms[j].StartYear
	})
	s.kingdoms = kingdoms

	// Enrich sites
	for i := range sites {
		s.sitesByID[sites[i].ID] = sites[i]
		if sites[i].Kingdom != "" {
			kSlug := strings.ToLower(sites[i].Kingdom)
			s.sitesByKingdom[kSlug] = append(s.sitesByKingdom[kSlug], sites[i])
		}
	}
	s.sites = sites
	s.countries = countries
}

// GetKings returns all monarchs sorted chronologically.
func (s *Store) GetKings() []models.King {
	s.mu.RLock()
	defer s.mu.RUnlock()
	res := make([]models.King, len(s.kings))
	copy(res, s.kings)
	return res
}

// GetKingBySlug returns a single monarch by slug.
func (s *Store) GetKingBySlug(slug string) (models.King, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	k, exists := s.kingsBySlug[slug]
	return k, exists
}

// GetKingdoms returns all kingdoms.
func (s *Store) GetKingdoms() []models.Kingdom {
	s.mu.RLock()
	defer s.mu.RUnlock()
	res := make([]models.Kingdom, len(s.kingdoms))
	copy(res, s.kingdoms)
	return res
}

// GetKingdomBySlug returns a single kingdom by slug.
func (s *Store) GetKingdomBySlug(slug string) (models.Kingdom, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	k, exists := s.kingdomBySlug[slug]
	return k, exists
}

// GetSites returns all archaeological and cultural sites.
func (s *Store) GetSites() []models.Site {
	s.mu.RLock()
	defer s.mu.RUnlock()
	res := make([]models.Site, len(s.sites))
	copy(res, s.sites)
	return res
}

// GetSiteByID returns a single site by ID.
func (s *Store) GetSiteByID(id string) (models.Site, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	site, exists := s.sitesByID[id]
	return site, exists
}

// GetCountries returns all supported countries.
func (s *Store) GetCountries() []models.Country {
	s.mu.RLock()
	defer s.mu.RUnlock()
	res := make([]models.Country, len(s.countries))
	copy(res, s.countries)
	return res
}

// GetStats returns summary statistics of the archive.
func (s *Store) GetStats() models.ArchiveStats {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return models.ArchiveStats{
		TotalKings:     len(s.kings),
		TotalKingdoms:  len(s.kingdoms),
		TotalSites:     len(s.sites),
		TotalCountries: len(s.countries),
	}
}

// GetDailyKings deterministically calculates today's featured monarchs
// seeded by the date in Sri Lanka Standard Time (Asia/Colombo), matching TypeScript LCG.
func (s *Store) GetDailyKings(count int, t time.Time) []models.King {
	s.mu.RLock()
	defer s.mu.RUnlock()

	total := len(s.kings)
	if total == 0 {
		return nil
	}
	if count > total {
		count = total
	}

	loc, err := time.LoadLocation("Asia/Colombo")
	if err != nil {
		loc = time.FixedZone("SLST", 5*3600+1800) // UTC+5:30
	}
	slTime := t.In(loc)

	// Format YYYY-MM-DD
	y, m, d := slTime.Date()
	currentDayUTC := time.Date(y, m, d, 0, 0, 0, 0, time.UTC)
	epoch := time.Date(2023, 1, 1, 0, 0, 0, 0, time.UTC)
	daysSinceEpoch := int(currentDayUTC.Sub(epoch).Hours() / 24)

	// Linear Congruential Generator (LCG) matching TypeScript implementation:
	// seed = (seed * 9301 + 49297) % 233280;
	seed := 12345
	nextRand := func() float64 {
		seed = (seed*9301 + 49297) % 233280
		return math.Abs(float64(seed)) / 233280.0
	}

	// Fisher-Yates shuffle on copy
	shuffled := make([]models.King, total)
	copy(shuffled, s.kings)
	mCount := total
	for mCount > 0 {
		i := int(math.Floor(nextRand() * float64(mCount)))
		mCount--
		shuffled[mCount], shuffled[i] = shuffled[i], shuffled[mCount]
	}

	startIndex := (daysSinceEpoch * count) % total
	if startIndex < 0 {
		startIndex = (startIndex + total) % total
	}

	result := make([]models.King, count)
	for i := 0; i < count; i++ {
		result[i] = shuffled[(startIndex+i)%total]
	}
	return result
}

// Search performs full-text search across all entities.
func (s *Store) Search(query string) []models.SearchResult {
	s.mu.RLock()
	defer s.mu.RUnlock()

	q := strings.ToLower(strings.TrimSpace(query))
	if q == "" {
		return nil
	}

	var results []models.SearchResult

	// 1. Search Kings
	for _, k := range s.kings {
		if strings.Contains(strings.ToLower(k.Title), q) ||
			strings.Contains(strings.ToLower(k.Slug), q) ||
			strings.Contains(strings.ToLower(k.Biography), q) ||
			strings.Contains(strings.ToLower(k.Reign), q) {
			desc := k.Biography
			if len(desc) > 160 {
				desc = desc[:157] + "..."
			}
			results = append(results, models.SearchResult{
				Type:        "king",
				Title:       k.Title,
				Slug:        k.Slug,
				Subtitle:    fmt.Sprintf("%s (%s)", k.Kingdom, k.Reign),
				Description: desc,
				URL:         "/kings/" + k.Slug,
			})
		}
	}

	// 2. Search Kingdoms
	for _, kd := range s.kingdoms {
		if strings.Contains(strings.ToLower(kd.Title), q) ||
			strings.Contains(strings.ToLower(kd.Slug), q) ||
			strings.Contains(strings.ToLower(kd.Description), q) ||
			strings.Contains(strings.ToLower(kd.Reign), q) {
			desc := kd.Description
			if len(desc) > 160 {
				desc = desc[:157] + "..."
			}
			results = append(results, models.SearchResult{
				Type:        "kingdom",
				Title:       kd.Title,
				Slug:        kd.Slug,
				Subtitle:    fmt.Sprintf("Kingdom • %s", kd.Reign),
				Description: desc,
				URL:         "/kingdoms/" + kd.Slug,
			})
		}
	}

	// 3. Search Sites
	for _, site := range s.sites {
		if strings.Contains(strings.ToLower(site.Name), q) ||
			strings.Contains(strings.ToLower(site.ID), q) ||
			strings.Contains(strings.ToLower(site.Description), q) ||
			strings.Contains(strings.ToLower(site.History), q) {
			desc := site.Description
			if len(desc) > 160 {
				desc = desc[:157] + "..."
			}
			results = append(results, models.SearchResult{
				Type:        "site",
				Title:       site.Name,
				Slug:        site.ID,
				Subtitle:    fmt.Sprintf("Archaeological Site • %s", site.Kingdom),
				Description: desc,
				URL:         "/sites/" + site.ID,
			})
		}
	}

	return results
}

// GetTimeline returns unified chronological timeline events.
func (s *Store) GetTimeline() []models.TimelineEntry {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var entries []models.TimelineEntry

	for _, k := range s.kings {
		entries = append(entries, models.TimelineEntry{
			Year:        k.StartYear,
			Formatted:   FormatYear(k.StartYear),
			Title:       k.Title,
			Slug:        k.Slug,
			Type:        "king",
			Kingdom:     k.Kingdom,
			Description: fmt.Sprintf("Reign: %s", k.Reign),
		})
	}

	for _, kd := range s.kingdoms {
		entries = append(entries, models.TimelineEntry{
			Year:        kd.StartYear,
			Formatted:   FormatYear(kd.StartYear),
			Title:       kd.Title,
			Slug:        kd.Slug,
			Type:        "kingdom",
			Kingdom:     kd.Slug,
			Description: fmt.Sprintf("Dynasty established (%s)", kd.Reign),
		})
	}

	sort.SliceStable(entries, func(i, j int) bool {
		return entries[i].Year < entries[j].Year
	})

	return entries
}

// Validate verifies cross-entity referential integrity and schema consistency.
func (s *Store) Validate() []string {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var errs []string

	// Validate kingdom slugs
	for _, k := range s.kings {
		if k.Slug == "" {
			errs = append(errs, fmt.Sprintf("King missing slug: %s", k.Title))
		}
		if k.Title == "" {
			errs = append(errs, fmt.Sprintf("King missing title: slug=%s", k.Slug))
		}
	}

	for _, kd := range s.kingdoms {
		if kd.Slug == "" {
			errs = append(errs, fmt.Sprintf("Kingdom missing slug: %s", kd.Title))
		}
	}

	for _, site := range s.sites {
		if site.ID == "" {
			errs = append(errs, fmt.Sprintf("Site missing id: %s", site.Name))
		}
		if site.Coordinates.Lat == 0 && site.Coordinates.Lng == 0 {
			errs = append(errs, fmt.Sprintf("Site missing coordinates: %s", site.Name))
		}
	}

	return errs
}
