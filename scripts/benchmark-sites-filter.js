const fs = require('fs');
const path = require('path');

function load(rel) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', rel), 'utf8'));
}

const kingdoms = load('src/data/kingdoms.json');
const sitesData = load('src/data/sites.json');

console.log(`Loaded ${kingdoms.length} kingdoms and ${sitesData.length} sites.`);

const ITERATIONS = 10000;

console.log(`Running benchmark with ${ITERATIONS} iterations...`);

const start = performance.now();

for (let i = 0; i < ITERATIONS; i++) {
  for (const kingdom of kingdoms) {
    const kingdomSites = sitesData.filter((site) =>
      site.kingdomSlug === kingdom.slug
    );
  }
}

const end = performance.now();
const duration = end - start;

console.log(`Benchmark completed in ${duration.toFixed(2)}ms`);
console.log(`Average time per iteration: ${(duration / ITERATIONS).toFixed(4)}ms`);
