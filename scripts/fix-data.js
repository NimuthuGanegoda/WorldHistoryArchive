const fs = require('fs');
const path = require('path');

const countriesPath = path.join(__dirname, '../src/data/countries.json');
const countries = JSON.parse(fs.readFileSync(countriesPath, 'utf8'));

// Regex to check if reign has letters (meaning it has era marker or text like "c.")
const hasTextRegex = /[a-zA-Z]/;

countries.forEach(country => {
  console.log(`Fixing data for ${country.slug}...`);
  const kingsPath = path.join(__dirname, `../src/data/${country.slug}/kings.json`);
  const kingdomsPath = path.join(__dirname, `../src/data/${country.slug}/kingdoms.json`);

  if (!fs.existsSync(kingsPath) || !fs.existsSync(kingdomsPath)) {
    console.warn(`Data not found for ${country.slug}, skipping.`);
    return;
  }

  const kings = JSON.parse(fs.readFileSync(kingsPath, 'utf8'));
  const kingdoms = JSON.parse(fs.readFileSync(kingdomsPath, 'utf8'));

  // Fix Kings
  let kingsFixed = 0;
  kings.forEach(king => {
    if (king.reign && !hasTextRegex.test(king.reign)) {
      // No letters, so it's just numbers and separators. Assume CE.
      king.reign = `${king.reign} CE`;
      kingsFixed++;
    }
  });

  console.log(`[${country.slug}] Fixed ${kingsFixed} kings missing era markers.`);

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

      kingdom.reign = newReign;
      kingdomsFixed++;
    }
  });

  console.log(`[${country.slug}] Updated reign for ${kingdomsFixed} kingdoms.`);

  fs.writeFileSync(kingsPath, JSON.stringify(kings, null, 2));
  fs.writeFileSync(kingdomsPath, JSON.stringify(kingdoms, null, 2));
});

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
    const tempMin = -max;
    const tempMax = -min;
    min = tempMin;
    max = tempMax;
  }

  // Special handling for Century?
  if (/century/i.test(normalized)) {
      if (max < 20) {
         min = min * 100 - 99;
         max = max * 100;
         if (isBCE) {
             return { min: -200, max: -100 };
         }
      }
  }

  return { min, max };
}
