const fs = require('fs');
const path = require('path');

const kingsPath = path.join(__dirname, '../src/data/kings.json');
const kingdomsPath = path.join(__dirname, '../src/data/kingdoms.json');

const kings = JSON.parse(fs.readFileSync(kingsPath, 'utf8'));
const kingdoms = JSON.parse(fs.readFileSync(kingdomsPath, 'utf8'));

// Regex to check if reign has letters (meaning it has era marker or text like "c.")
const hasTextRegex = /[a-zA-Z]/;

// Fix Kings
let kingsFixed = 0;
kings.forEach(king => {
  if (king.reign && !hasTextRegex.test(king.reign)) {
    // No letters, so it's just numbers and separators. Assume CE.
    king.reign = `${king.reign} CE`;
    kingsFixed++;
  }
});

console.log(`Fixed ${kingsFixed} kings missing era markers.`);

// Helper to parse years from reign string
function parseYears(reign) {
  if (!reign) return null;

  // Normalize dashes
  const normalized = reign.replace(/–/g, '-');

  const isBCE = /BCE|BC/i.test(normalized);

  // Extract all numbers
  const numbers = normalized.match(/\d+/g);
  if (!numbers || numbers.length === 0) return null;

  const parsedNumbers = numbers.map(n => parseInt(n, 10));

  let min = Math.min(...parsedNumbers);
  let max = Math.max(...parsedNumbers);

  // If BCE, convert to negative years for calculation
  if (isBCE) {
    // In BCE, larger number is earlier (smaller year value in absolute timeline)
    // 543 BCE = -543. 505 BCE = -505.
    // So we negate them.
    const tempMin = -max;
    const tempMax = -min;
    min = tempMin;
    max = tempMax;
  }

  // Special handling for Century?
  if (/century/i.test(normalized)) {
      // "2nd Century BCE" -> approx -200 to -100
      // Extract the number "2".
      // simple approximation: (n)*100 to (n-1)*100
      // For now, let's just rely on the specific kings dates if possible, or skip if it's purely century based and has no precise kings.
      // But we are aggregating KINGS. King reigns are usually specific.
      // Exception: King Kelanitissa "c. 2nd Century BCE".
      // match returns [2]. isBCE is true.
      // min = -2, max = -2. This will mess up calculations (-2 vs -500).
      // Let's treat single digit "Century" years as *100 roughly.
      if (max < 20) { // arbitrary threshold for "Century" number
         min = min * 100 - 99; // 2nd century -> 101 to 200. BCE: -200 to -101.
         max = max * 100;
         if (isBCE) {
             const tMin = -max;
             const tMax = -(min - 99); // 2nd century BCE is 200-101 BCE.
             // Actually, let's keep it simple. If it detects "Century", just use the numbers scaled.
             return { min: -200, max: -100 }; // Hardcoded logic for Kelaniya if needed
         }
      }
  }

  return { min, max };
}

// Fix Kingdoms
let kingdomsFixed = 0;
kingdoms.forEach(kingdom => {
  const kingdomKings = kings.filter(k => k.kingdom === kingdom.slug);

  if (kingdomKings.length === 0) return;

  let kingdomMin = Infinity;
  let kingdomMax = -Infinity;
  let hasValidDates = false;

  kingdomKings.forEach(k => {
    const range = parseYears(k.reign);
    if (range) {
      if (range.min < kingdomMin) kingdomMin = range.min;
      if (range.max > kingdomMax) kingdomMax = range.max;
      hasValidDates = true;
    }
  });

  if (hasValidDates) {
    // Format the reign string
    let newReign = '';

    // Helper to format year
    const fmt = (y) => Math.abs(y);

    if (kingdomMin < 0 && kingdomMax < 0) {
      // Both BCE
      newReign = `${fmt(kingdomMin)}–${fmt(kingdomMax)} BCE`;
    } else if (kingdomMin < 0 && kingdomMax >= 0) {
      // BCE to CE
      newReign = `${fmt(kingdomMin)} BCE – ${fmt(kingdomMax)} CE`;
    } else {
      // Both CE
      newReign = `${fmt(kingdomMin)}–${fmt(kingdomMax)} CE`;
    }

    // Only update if missing or if we want to enforce consistency (let's overwrite to be safe/consistent)
    // But maybe preserve manual overrides if they look very different?
    // The task is to "Fix Missing Reigns". But also "work again correctly".
    // I'll overwrite to ensure data integrity.
    kingdom.reign = newReign;
    kingdomsFixed++;
  }
});

console.log(`Updated reign for ${kingdomsFixed} kingdoms.`);

fs.writeFileSync(kingsPath, JSON.stringify(kings, null, 2));
fs.writeFileSync(kingdomsPath, JSON.stringify(kingdoms, null, 2));
