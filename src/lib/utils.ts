// Hoisted regex patterns to avoid recompilation
const CENTURY_REGEX = /(\d+)(?:st|nd|rd|th)?\s*(?:c\.|century|c\b)/i;
const YEAR_REGEX = /(\d+)/;
const BCE_REGEX = /bce|bc/i;

export function parseStartYear(reign: string): number {
  if (!reign) return 9999;

  // Handle "Century" cases (e.g., "2nd Century BCE", "c. 2nd c. BCE")
  // Matches: number + optional ordinal suffix + optional space + "c" or "century"
  const centuryMatch = reign.match(CENTURY_REGEX);

  if (centuryMatch) {
    const century = parseInt(centuryMatch[1], 10);

    if (BCE_REGEX.test(reign)) {
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

  if (BCE_REGEX.test(reign)) {
    year = -year;
  }

  return year;
}

/**
 * Deterministically shuffles an array based on the Sri Lanka date and returns a slice.
 * This ensures the "Featured Kings" list updates every day at midnight Sri Lanka Standard Time (SLST),
 * consistent for all users globally and aligned with the daily static build (which runs at 18:30 UTC = 00:00 SLST).
 *
 * @param items The array of items to shuffle (e.g., kings).
 * @param count The number of items to return.
 * @param date The date to use for seeding (default: now).
 * @returns An array of `count` items, shuffled deterministically.
 */
export function getDailyKings<T>(items: T[], count: number = 6, date: Date = new Date()): T[] {
  // Use Asia/Colombo for date string (YYYY-MM-DD)
  // This ensures the rotation aligns with midnight in Sri Lanka
  const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatter = new Intl.DateTimeFormat('en-CA', options); // en-CA gives YYYY-MM-DD format
  const today = formatter.format(date);

  // Simple hash function for the date string to create a numerical seed
  let seed = 0;
  for (let i = 0; i < today.length; i++) {
    seed = ((seed << 5) - seed) + today.charCodeAt(i);
    seed |= 0; // Convert to 32bit integer
  }

  // Create a copy to avoid mutating the original array
  const shuffled = [...items];
  let m = shuffled.length;

  // Simple Linear Congruential Generator (LCG)
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return Math.abs(seed) / 233280;
  };

  // Fisher-Yates shuffle with seeded random
  while (m) {
    const i = Math.floor(random() * m--);
    [shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]];
  }

  return shuffled.slice(0, count);
}
