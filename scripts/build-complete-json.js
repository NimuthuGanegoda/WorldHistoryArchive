const fs = require('fs');
const path = require('path');

const jsonOutputDir = path.join(__dirname, '..', 'json-output');

// Read all individual JSON files
const kings = JSON.parse(fs.readFileSync(path.join(jsonOutputDir, 'kings.json'), 'utf8'));
const kingdoms = JSON.parse(fs.readFileSync(path.join(jsonOutputDir, 'kingdoms.json'), 'utf8'));
const index = JSON.parse(fs.readFileSync(path.join(jsonOutputDir, 'index.json'), 'utf8'));
const kingdomsList = JSON.parse(fs.readFileSync(path.join(jsonOutputDir, 'kingdoms-list.json'), 'utf8'));
const kingsList = JSON.parse(fs.readFileSync(path.join(jsonOutputDir, 'kings-list.json'), 'utf8'));
const sites = JSON.parse(fs.readFileSync(path.join(jsonOutputDir, 'sites.json'), 'utf8'));

// Create comprehensive complete.json
const complete = {
  meta: {
    title: "Sri Lanka History - Complete Dataset",
    description: "Comprehensive historical data of Sri Lankan kingdoms, monarchs, and archaeological sites",
    version: "1.0.0",
    generated: new Date().toISOString(),
    stats: {
      totalKings: kings.length,
      totalKingdoms: kingdoms.length,
      totalSites: sites.sites.length,
      dataFiles: 6
    }
  },
  pages: {
    index: index,
    kingdomsList: kingdomsList,
    kingsList: kingsList,
    sites: sites
  },
  data: {
    kingdoms: kingdoms,
    kings: kings
  }
};

// Write the complete file
fs.writeFileSync(
  path.join(jsonOutputDir, 'complete.json'),
  JSON.stringify(complete, null, 2)
);

console.log('✅ Updated complete.json with all data');
console.log(`\nDataset Summary:`);
console.log(`- Kings: ${complete.meta.stats.totalKings}`);
console.log(`- Kingdoms: ${complete.meta.stats.totalKingdoms}`);
console.log(`- Sites: ${complete.meta.stats.totalSites}`);
console.log(`- Total JSON files: ${complete.meta.stats.dataFiles + 1}`);
