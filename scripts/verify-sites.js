const fs = require('fs');
const path = require('path');

function load(rel){
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname,'..',rel),'utf8'));
  } catch (e) {
    return null;
  }
}

const countries = load('src/data/countries.json');
let errors = [];

if (countries) {
  countries.forEach(country => {
      const kings = load(`src/data/${country.slug}/kings.json`);
      const sites = load(`src/data/${country.slug}/sites.json`);

      if (!kings) {
          errors.push(`[${country.slug}] Could not load kings.json`);
          return;
      }
      if (!sites) {
          errors.push(`[${country.slug}] Could not load sites.json`);
          return;
      }

      const kingSlugs = new Set(kings.map(k => k.slug));

      sites.forEach(site => {
          if (site.builtByKingId && !kingSlugs.has(site.builtByKingId)) {
              errors.push(`[${country.slug}] Site '${site.name}' references unknown king '${site.builtByKingId}'`);
          }
      });
  });
} else {
    console.error("Could not load countries.json");
    process.exit(1);
}

if (errors.length) {
  console.error('Validation FAILED');
  errors.forEach(e => console.error(e));
  process.exit(1);
} else {
  console.log('Validation PASSED');
}
