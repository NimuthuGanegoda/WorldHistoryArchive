const fs = require('fs');
const path = require('path');

const kingsFile = path.join(__dirname, '../src/data/kings.json');
const kings = JSON.parse(fs.readFileSync(kingsFile, 'utf8'));

// Function to extract start year from reign string
function extractStartYear(reign) {
  if (!reign) return 9999;
  
  // Handle various formats
  // "543–505 BCE" -> -543
  // "161–137 BCE" -> -161
  // "215–237 CE" -> 215
  // "c. 2nd c. BCE" -> -200
  // "1707–1739" -> 1707
  
  const match = reign.match(/(\d+)/);
  if (!match) return 9999;
  
  const year = parseInt(match[1]);
  
  // Check if BCE
  if (reign.includes('BCE') || reign.includes('BC')) {
    return -year;
  }
  
  return year;
}

// Sort kings by start year
kings.sort((a, b) => {
  const yearA = extractStartYear(a.reign);
  const yearB = extractStartYear(b.reign);
  return yearA - yearB;
});

// Write sorted data
fs.writeFileSync(kingsFile, JSON.stringify(kings, null, 2), 'utf8');

console.log(`✓ Sorted ${kings.length} kings chronologically`);
console.log('\nFirst 10 kings:');
kings.slice(0, 10).forEach(k => {
  console.log(`  ${k.reign.padEnd(20)} - ${k.title}`);
});
console.log('\nLast 10 kings:');
kings.slice(-10).forEach(k => {
  console.log(`  ${k.reign.padEnd(20)} - ${k.title}`);
});
