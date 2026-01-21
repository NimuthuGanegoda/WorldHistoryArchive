const fs = require('fs');
const path = require('path');

const KINGS_FILE = path.join(__dirname, '..', 'data', 'kings.json');
const ENRICHED_FILE = path.join(__dirname, '..', 'data', 'enriched-biographies.json');

const kings = JSON.parse(fs.readFileSync(KINGS_FILE, 'utf8'));
const enriched = JSON.parse(fs.readFileSync(ENRICHED_FILE, 'utf8'));

const enrichedMap = new Map(enriched.map(e => [e.slug, e.biography_enriched]));

let updatedCount = 0;

const updatedKings = kings.map(king => {
  if (enrichedMap.has(king.slug)) {
    const enrichedBio = enrichedMap.get(king.slug);
    if (king.biography !== enrichedBio) {
      king.biography = enrichedBio;
      updatedCount++;
    }
  }
  return king;
});

if (updatedCount > 0) {
  fs.writeFileSync(KINGS_FILE, JSON.stringify(updatedKings, null, 2) + '\n');
  console.log(`Updated ${updatedCount} kings with enriched biographies.`);
} else {
  console.log('No updates needed.');
}
