const fs = require('fs');
const path = require('path');

// Load kings data
const kingsPath = path.join(__dirname, '../src/data/kings.json');
const kings = JSON.parse(fs.readFileSync(kingsPath, 'utf8'));

/**
 * Deterministically shuffles an array based on the date and returns a slice.
 * Copied from src/lib/utils.ts to ensure consistent logic testing.
 */
function getDailyKings(items, count = 6, date = new Date(), timeZone = 'Asia/Colombo') {
  const options = { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatter = new Intl.DateTimeFormat('en-CA', options);
  const today = formatter.format(date);

  const [year, month, day] = today.split('-').map(Number);
  const currentDayTime = Date.UTC(year, month - 1, day);
  const epoch = Date.UTC(2023, 0, 1);
  const msPerDay = 24 * 60 * 60 * 1000;
  const dayIndex = Math.floor((currentDayTime - epoch) / msPerDay);

  const totalItems = items.length;
  if (totalItems === 0) return [];

  // Seed the shuffle with a fixed salt so the array order remains constant
  let seed = 12345;

  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return Math.abs(seed) / 233280;
  };

  const shuffled = [...items];
  let m = shuffled.length;

  while (m) {
    const i = Math.floor(random() * m--);
    [shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]];
  }

  // Calculate the starting index based on the day to cycle through all items
  count = Math.min(count, totalItems);
  const startIndex = (dayIndex * count) % totalItems;
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(shuffled[(startIndex + i) % totalItems]);
  }

  return result;
}

// Simulate next 7 days
console.log('Verifying Daily Kings Rotation (Next 7 Days)...');
console.log('------------------------------------------------');

const startDate = new Date();
const history = new Set();

for (let i = 0; i < 7; i++) {
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + i);

  const daily = getDailyKings(kings, 6, date);

  // Create a unique key for this set of kings
  const slugs = daily.map(k => k.slug).sort().join(',');

  const options = { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' };
  const dateStr = new Intl.DateTimeFormat('en-CA', options).format(date);

  console.log(`Date: ${dateStr}`);
  console.log(`Kings: ${daily.map(k => k.title).join(', ')}`);
  console.log('------------------------------------------------');

  if (history.has(slugs)) {
    console.error(`ERROR: Duplicate set of kings found for ${dateStr}! Rotation is not working.`);
    process.exit(1);
  }
  history.add(slugs);
}

console.log('SUCCESS: Kings are rotating correctly for the next 7 days.');
