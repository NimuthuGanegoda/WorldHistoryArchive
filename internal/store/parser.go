package store

import (
	"regexp"
	"strconv"
	"strings"
)

var (
	centuryRegex = regexp.MustCompile(`(?i)(\d+)(?:st|nd|rd|th)?\s*(?:c\.|century|c\b)`)
	yearRegex    = regexp.MustCompile(`(\d+)`)
	bceRegex     = regexp.MustCompile(`(?i)bce|bc`)
)

// ParseStartYear extracts the chronological start year from a reign string.
// Negative integers represent BCE/BC dates.
func ParseStartYear(reign string) int {
	if strings.TrimSpace(reign) == "" {
		return 9999
	}

	// 1. Handle Century cases (e.g., "2nd Century BCE", "c. 2nd c. BCE")
	if matches := centuryRegex.FindStringSubmatch(reign); len(matches) > 1 {
		century, err := strconv.Atoi(matches[1])
		if err == nil {
			if bceRegex.MatchString(reign) {
				// 2nd Century BCE -> -200
				return -(century * 100)
			}
			// 1st Century CE -> 0, 2nd Century CE -> 100
			return (century - 1) * 100
		}
	}

	// 2. Handle standard year cases (e.g., "543–505 BCE", "1017–1070 CE")
	if match := yearRegex.FindString(reign); match != "" {
		year, err := strconv.Atoi(match)
		if err == nil {
			if bceRegex.MatchString(reign) {
				return -year
			}
			return year
		}
	}

	return 9999
}

// FormatYear formats an integer year into a human-readable string (e.g., -543 -> "543 BCE", 1017 -> "1017 CE").
func FormatYear(year int) string {
	if year == 9999 {
		return "Unknown Date"
	}
	if year < 0 {
		return strconv.Itoa(-year) + " BCE"
	}
	if year == 0 {
		return "1 CE"
	}
	return strconv.Itoa(year) + " CE"
}
