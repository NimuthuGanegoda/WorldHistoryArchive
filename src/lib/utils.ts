// Hoisted regex patterns to avoid recompilation
const CENTURY_REGEX = /(\d+)(?:st|nd|rd|th)?\s*(?:c\.|century|c\b)/;
const YEAR_REGEX = /(\d+)/;

export function parseStartYear(reign: string): number {
  if (!reign) return 9999;

  // Normalize spaces and case for easier matching
  const normalized = reign.toLowerCase();

  // Handle "Century" cases (e.g., "2nd Century BCE", "c. 2nd c. BCE")
  // Matches: number + optional ordinal suffix + optional space + "c" or "century"
  const centuryMatch = normalized.match(CENTURY_REGEX);

  if (centuryMatch) {
    const century = parseInt(centuryMatch[1], 10);

    if (normalized.includes('bce') || normalized.includes('bc')) {
      // 2nd Century BCE -> -200
      return -(century * 100);
    }
    // 1st Century CE -> 0, 2nd Century CE -> 100
    return (century - 1) * 100;
  }

  // Handle standard cases (e.g., "543–505 BCE", "1017–1070 CE")
  // Just extract the first number found
  const match = reign.match(YEAR_REGEX);
  if (!match) return 9999;

  let year = parseInt(match[0], 10);

  if (reign.includes('BCE') || reign.includes('BC')) {
    year = -year;
  }

  return year;
}
