const fs = require('fs');
const path = require('path');

const kings = JSON.parse(fs.readFileSync('src/data/kings.json', 'utf8'));
const sites = JSON.parse(fs.readFileSync('src/data/sites.json', 'utf8'));

const kingSlugs = new Set(kings.map(k => k.slug));
const errors = [];

sites.forEach(site => {
  if (site.builtByKingId && !kingSlugs.has(site.builtByKingId)) {
    errors.push(`Site '${site.name}' references unknown king '${site.builtByKingId}'`);
  }
});

if (errors.length) {
  console.error('Validation FAILED');
  errors.forEach(e => console.error(e));
  process.exit(1);
} else {
  console.log('Validation PASSED');
}
