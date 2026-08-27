package models

// InfoBox represents a key highlighted fact or metadata box.
type InfoBox struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

// Section represents a structured section in a biography or kingdom description.
type Section struct {
	Heading   string    `json:"heading"`
	Content   []string  `json:"content"`
	InfoBoxes []InfoBox `json:"infoBoxes,omitempty"`
}

// King represents a monarch, ruler, or regent in the historical archive.
type King struct {
	Slug                     string    `json:"slug"`
	Title                    string    `json:"title"`
	Reign                    string    `json:"reign"`
	Kingdom                  string    `json:"kingdom"`
	KingdomSlug              string    `json:"kingdomSlug,omitempty"`
	Country                  string    `json:"country,omitempty"`
	CountrySlug              string    `json:"countrySlug,omitempty"`
	Biography                string    `json:"biography"`
	Sections                 []Section `json:"sections,omitempty"`
	InternationalConnections string    `json:"internationalConnections,omitempty"`
	StartYear                int       `json:"startYear,omitempty"`
}

// Kingdom represents a historical dynasty, realm, or kingdom (Sub-Category).
type Kingdom struct {
	Slug        string    `json:"slug"`
	Title       string    `json:"title"`
	Reign       string    `json:"reign"`
	Country     string    `json:"country,omitempty"`
	CountrySlug string    `json:"countrySlug,omitempty"`
	Capital     string    `json:"capital,omitempty"`
	StartYear   int       `json:"startYear,omitempty"`
	RulerCount  int       `json:"rulerCount,omitempty"`
	SiteCount   int       `json:"siteCount,omitempty"`
	Description string    `json:"description,omitempty"`
	Biography   string    `json:"biography,omitempty"`
	Sections    []Section `json:"sections,omitempty"`
}

// Coordinates represents geographic latitude and longitude.
type Coordinates struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

// Site represents an archaeological site, monument, stupa, or historical landmark.
type Site struct {
	ID            string      `json:"id"`
	Name          string      `json:"name"`
	Kingdom       string      `json:"kingdom"`
	KingdomSlug   string      `json:"kingdomSlug,omitempty"`
	Period        string      `json:"period,omitempty"`
	Type          string      `json:"type"`
	BuiltBy       string      `json:"builtBy,omitempty"`
	BuiltByKingID string      `json:"builtByKingId,omitempty"`
	Constructed   string      `json:"constructed,omitempty"`
	Description   string      `json:"description"`
	History       string      `json:"history,omitempty"`
	Construction  string      `json:"construction,omitempty"`
	Architecture  string      `json:"architecture,omitempty"`
	Significance  string      `json:"significance,omitempty"`
	CurrentStatus string      `json:"currentStatus,omitempty"`
	GoogleMapsURL string      `json:"googleMapsUrl,omitempty"`
	Media         []string    `json:"media,omitempty"`
	Coordinates   Coordinates `json:"coordinates"`
	Country       string      `json:"country,omitempty"`
	CountrySlug   string      `json:"countrySlug,omitempty"`
}

// Region represents a sub-geographic province or zone within a civilization.
type Region struct {
	Name       string    `json:"name"`
	Center     []float64 `json:"center,omitempty"`
	MajorSites []string  `json:"major_sites,omitempty"`
}

// Country represents a primary Civilization / Country category.
type Country struct {
	Slug          string      `json:"slug"`
	Name          string      `json:"name"`
	Code          string      `json:"code"`
	Center        []float64   `json:"center,omitempty"`
	Bounds        [][]float64 `json:"bounds,omitempty"`
	Zoom          int         `json:"zoom,omitempty"`
	Description   string      `json:"description,omitempty"`
	Regions       []Region    `json:"regions,omitempty"`
	KingdomsCount int         `json:"kingdomsCount,omitempty"`
	RulersCount   int         `json:"rulersCount,omitempty"`
	SitesCount    int         `json:"sitesCount,omitempty"`
}

// SearchResult represents a unified search hit across entities.
type SearchResult struct {
	Type        string `json:"type"` // "country", "kingdom", "king", "site"
	Title       string `json:"title"`
	Slug        string `json:"slug"`
	Subtitle    string `json:"subtitle"`
	Description string `json:"description"`
	URL         string `json:"url"`
}

// TimelineEntry represents a unified chronological milestone.
type TimelineEntry struct {
	Year        int    `json:"year"`
	Formatted   string `json:"formatted"`
	Title       string `json:"title"`
	Slug        string `json:"slug"`
	Type        string `json:"type"` // "country", "kingdom", "king", "site"
	Kingdom     string `json:"kingdom"`
	Country     string `json:"country,omitempty"`
	Description string `json:"description"`
}

// ArchiveStats provides summary analytics of the historical dataset.
type ArchiveStats struct {
	TotalKings     int `json:"totalKings"`
	TotalKingdoms  int `json:"totalKingdoms"`
	TotalSites     int `json:"totalSites"`
	TotalCountries int `json:"totalCountries"`
}
