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
