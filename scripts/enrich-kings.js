const fs = require('fs');
const path = require('path');

const kingsPath = path.join(__dirname, '../src/data/sri-lanka/kings.json');
const enrichedPath = path.join(__dirname, '../data/enriched-biographies.json');

if (!fs.existsSync(enrichedPath)) {
  console.error(`Error: Enriched biographies file not found at ${enrichedPath}`);
  process.exit(1);
}

if (!fs.existsSync(kingsPath)) {
  console.error(`Error: Kings file not found at ${kingsPath}`);
  process.exit(1);
}

const kings = JSON.parse(fs.readFileSync(kingsPath, 'utf8'));
const enrichedBiographies = JSON.parse(fs.readFileSync(enrichedPath, 'utf8'));

// Create a map for faster lookup
const enrichedMap = new Map(enrichedBiographies.map(item => [item.slug, item.biography_enriched]));

let updatedCount = 0;

const enrichedKings = kings.map(king => {
  if (enrichedMap.has(king.slug)) {
    // Update the biography with the enriched version
    king.biography = enrichedMap.get(king.slug);
    updatedCount++;
  }
  return king;
});

fs.writeFileSync(kingsPath, JSON.stringify(enrichedKings, null, 2));

console.log(`Enriched ${updatedCount} kings with biographies.`);
