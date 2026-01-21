const fs = require('fs');
const path = require('path');

const KINGS_FILE = path.join(__dirname, '../data/kings.json');
const ENRICHED_FILE = path.join(__dirname, '../data/enriched-biographies.json');

function loadJSON(filepath) {
  if (!fs.existsSync(filepath)) {
    console.error(`File not found: ${filepath}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function saveJSON(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function main() {
  const kings = loadJSON(KINGS_FILE);
  const enriched = loadJSON(ENRICHED_FILE);

  // Create a map for faster lookup
  const enrichedMap = new Map();
  enriched.forEach(item => {
    enrichedMap.set(item.slug, item.biography_enriched);
  });

  let updatedCount = 0;

  kings.forEach(king => {
    if (enrichedMap.has(king.slug)) {
      const enrichedBio = enrichedMap.get(king.slug);

      // If king has no biography, or it's empty, use the enriched one
      if (!king.biography || king.biography.trim() === '') {
        king.biography = enrichedBio;
        updatedCount++;
        // console.log(`Updated biography for ${king.name} (${king.slug})`);
      }
    }
  });

  if (updatedCount > 0) {
    saveJSON(KINGS_FILE, kings);
    console.log(`Successfully updated ${updatedCount} kings with enriched biographies.`);
  } else {
    console.log('No updates needed. All matching kings already have biographies.');
  }
}

main();
