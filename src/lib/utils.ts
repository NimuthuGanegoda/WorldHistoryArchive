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
 * consistent for all users globally and aligned with the daily static build (which runs at 19:00 UTC = 00:30 SLST).
 *
 * @param items The array of items to shuffle (e.g., kings).
 * @param count The number of items to return.
 * @param date The date to use for seeding (default: now).
 * @param timeZone The timezone to use for date calculation (default: 'Asia/Colombo').
 * @returns An array of `count` items, shuffled deterministically.
 */
export function getDailyKings<T>(items: T[], count: number = 6, date: Date = new Date(), timeZone: string = 'Asia/Colombo'): T[] {
  // Use specified timezone (default Asia/Colombo) for date string (YYYY-MM-DD)
  // This ensures the rotation aligns with midnight in the target timezone
  const options: Intl.DateTimeFormatOptions = { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatter = new Intl.DateTimeFormat('en-CA', options); // en-CA gives YYYY-MM-DD format
  const today = formatter.format(date);

  // Parse YYYY-MM-DD to get a stable day index
  // We use UTC to avoid daylight saving issues when calculating days since epoch
  const [year, month, day] = today.split('-').map(Number);
  const currentDayTime = Date.UTC(year, month - 1, day);
  const epoch = Date.UTC(2023, 0, 1); // Fixed epoch: Jan 1, 2023
  const msPerDay = 24 * 60 * 60 * 1000;
  const dayIndex = Math.floor((currentDayTime - epoch) / msPerDay);

  const totalItems = items.length;
  if (totalItems === 0) return [];

  // Seed the shuffle based on the day index
  // This ensures the order is randomly fully shuffled every day
  let seed = dayIndex + 12345; // Simple salt

  // Simple Linear Congruential Generator (LCG)
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return Math.abs(seed) / 233280;
  };

  // Create a copy to avoid mutating the original array
  const shuffled = [...items];
  let m = shuffled.length;

  // Fisher-Yates shuffle with seeded random
  while (m) {
    const i = Math.floor(random() * m--);
    [shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]];
  }

  // Select the slice
  const result: T[] = [];
  // Take the first `count` items from the fully shuffled array
  for (let i = 0; i < count && i < totalItems; i++) {
    result.push(shuffled[i]);
  }

  return result;
}
