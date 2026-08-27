package store

import (
	"testing"
	"time"

	"github.com/NimuthuGanegoda/WorldHistoryArchive/internal/models"
)

func TestParseStartYear(t *testing.T) {
	tests := []struct {
		reign    string
		expected int
	}{
		{"543–505 BCE", -543},
		{"205–161 BCE", -205},
		{"c. 2nd Century BCE", -200},
		{"c. 2nd c. BCE", -200},
		{"1017–1070 CE", 1017},
		{"1236–1284 CE", 1236},
		{"1st Century CE", 0},
		{"2nd Century CE", 100},
		{"", 9999},
	}

	for _, tt := range tests {
		got := ParseStartYear(tt.reign)
		if got != tt.expected {
			t.Errorf("ParseStartYear(%q) = %d, expected %d", tt.reign, got, tt.expected)
		}
	}
}

func TestStoreDailyKingsDeterministic(t *testing.T) {
	s := New()
	kings := []models.King{
		{Slug: "k1", Title: "King One", Reign: "100 CE"},
		{Slug: "k2", Title: "King Two", Reign: "200 CE"},
		{Slug: "k3", Title: "King Three", Reign: "300 CE"},
		{Slug: "k4", Title: "King Four", Reign: "400 CE"},
		{Slug: "k5", Title: "King Five", Reign: "500 CE"},
		{Slug: "k6", Title: "King Six", Reign: "600 CE"},
		{Slug: "k7", Title: "King Seven", Reign: "700 CE"},
	}
	s.populate(kings, nil, nil, nil)

	fixedDate := time.Date(2026, 8, 18, 12, 0, 0, 0, time.UTC)
	daily1 := s.GetDailyKings(3, fixedDate)
	daily2 := s.GetDailyKings(3, fixedDate)

	if len(daily1) != 3 {
		t.Fatalf("expected 3 daily kings, got %d", len(daily1))
	}

	for i := range daily1 {
		if daily1[i].Slug != daily2[i].Slug {
			t.Errorf("GetDailyKings not deterministic: index %d got %s vs %s", i, daily1[i].Slug, daily2[i].Slug)
		}
	}
}

func TestStoreSearch(t *testing.T) {
	s := New()
	kings := []models.King{
		{Slug: "dutugemunu", Title: "King Dutugemunu", Kingdom: "anuradhapura", Reign: "161–137 BCE", Biography: "Unified the island."},
		{Slug: "vijaya", Title: "King Vijaya", Kingdom: "tambapanni", Reign: "543–505 BCE", Biography: "First recorded king."},
	}
	kingdoms := []models.Kingdom{
		{Slug: "anuradhapura", Title: "Anuradhapura Kingdom", Reign: "437 BCE – 1017 CE"},
	}
	sites := []models.Site{
		{ID: "ruwanwelisaya", Name: "Ruwanwelisaya", Kingdom: "Anuradhapura", Description: "Great stupa."},
	}

	s.populate(kings, kingdoms, sites, nil)

	results := s.Search("Dutugemunu")
	if len(results) == 0 {
		t.Fatal("expected search results for 'Dutugemunu', got 0")
	}

	foundKing := false
	for _, r := range results {
		if r.Slug == "dutugemunu" && r.Type == "king" {
			foundKing = true
		}
	}
	if !foundKing {
		t.Error("expected to find king Dutugemunu in search results")
	}
}

func TestCountryKingdomHierarchy(t *testing.T) {
	s := New()
	countries := []models.Country{
		{Name: "Sri Lanka", Code: "LK", Slug: "sri-lanka", Description: "Island nation."},
		{Name: "Japan", Code: "JP", Slug: "japan", Description: "Island empire."},
	}
	kingdoms := []models.Kingdom{
		{Slug: "anuradhapura", Title: "Anuradhapura Kingdom", Reign: "437 BCE – 1017 CE", Country: "Sri Lanka"},
		{Slug: "edo-shogunate", Title: "Edo Shogunate", Reign: "1603–1868 CE", Country: "Japan"},
	}
	kings := []models.King{
		{Slug: "dutugemunu", Title: "King Dutugemunu", Kingdom: "anuradhapura", Country: "Sri Lanka", Reign: "161–137 BCE"},
		{Slug: "ieyasu", Title: "Tokugawa Ieyasu", Kingdom: "edo-shogunate", Country: "Japan", Reign: "1603–1605 CE"},
	}
	sites := []models.Site{
		{ID: "ruwanwelisaya", Name: "Ruwanwelisaya", Kingdom: "anuradhapura", Country: "Sri Lanka", Coordinates: models.Coordinates{Lat: 8.35, Lng: 80.39}},
		{ID: "himeji", Name: "Himeji Castle", Kingdom: "edo-shogunate", Country: "Japan", Coordinates: models.Coordinates{Lat: 34.83, Lng: 134.69}},
	}

	s.populate(kings, kingdoms, sites, countries)

	// Check country retrieval
	lk, exists := s.GetCountryBySlug("sri-lanka")
	if !exists || lk.Name != "Sri Lanka" {
		t.Fatalf("expected Sri Lanka country, got %v (exists=%v)", lk, exists)
	}
	if lk.KingdomsCount != 1 || lk.RulersCount != 1 || lk.SitesCount != 1 {
		t.Errorf("expected counts 1/1/1 for Sri Lanka, got %d/%d/%d", lk.KingdomsCount, lk.RulersCount, lk.SitesCount)
	}

	jp, exists := s.GetCountryBySlug("japan")
	if !exists || jp.Name != "Japan" {
		t.Fatalf("expected Japan country, got %v (exists=%v)", jp, exists)
	}
	if jp.KingdomsCount != 1 || jp.RulersCount != 1 || jp.SitesCount != 1 {
		t.Errorf("expected counts 1/1/1 for Japan, got %d/%d/%d", jp.KingdomsCount, jp.RulersCount, jp.SitesCount)
	}

	// Check kingdom subcategory filter
	lkKingdoms := s.GetKingdomsByCountry("sri-lanka")
	if len(lkKingdoms) != 1 || lkKingdoms[0].Slug != "anuradhapura" {
		t.Errorf("unexpected kingdoms for Sri Lanka: %v", lkKingdoms)
	}

	jpKings := s.GetKingsByCountry("japan")
	if len(jpKings) != 1 || jpKings[0].Slug != "ieyasu" {
		t.Errorf("unexpected kings for Japan: %v", jpKings)
	}

	jpSites := s.GetSitesByCountry("japan")
	if len(jpSites) != 1 || jpSites[0].ID != "himeji" {
		t.Errorf("unexpected sites for Japan: %v", jpSites)
	}
}

