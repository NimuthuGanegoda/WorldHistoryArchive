
const fs = require('fs');
const path = require('path');

// Mock data loading
const kingsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/kings.json'), 'utf8'));
const kingdomsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/kingdoms.json'), 'utf8'));

// Original implementation functions
function groupKingsByEra_Old(kings) {
  const eras = {
    'Ancient Period (543 BCE - 250 CE)': [],
    'Classical Period (250 CE - 1017 CE)': [],
    'Medieval Period (1017 CE - 1400 CE)': [],
    'Late Medieval Period (1400 CE - 1600 CE)': [],
    'Colonial Era (1600 CE - 1815 CE)': [],
  };

  kings.forEach(king => {
    const year = extractStartYear_Old(king.reign);

    if (year < 250) {
      eras['Ancient Period (543 BCE - 250 CE)'].push(king);
    } else if (year < 1017) {
      eras['Classical Period (250 CE - 1017 CE)'].push(king);
    } else if (year < 1400) {
      eras['Medieval Period (1017 CE - 1400 CE)'].push(king);
    } else if (year < 1600) {
      eras['Late Medieval Period (1400 CE - 1600 CE)'].push(king);
    } else {
      eras['Colonial Era (1600 CE - 1815 CE)'].push(king);
    }
  });

  return eras;
}

function extractStartYear_Old(reign) {
  if (!reign) return 9999;
  const match = reign.match(/(\d+)/);
  if (!match) return 9999;
  const year = parseInt(match[1]);
  if (reign.includes('BCE') || reign.includes('BC')) {
    return -year;
  }
  return year;
}

// New implementation setup
const YEAR_REGEX = /(\d+)/;
const kingdomMap = new Map(kingdomsData.map(k => [k.slug, k]));

function extractStartYear_New(reign) {
  if (!reign) return 9999;
  const match = reign.match(YEAR_REGEX);
  if (!match) return 9999;
  const year = parseInt(match[1]);
  if (reign.includes('BCE') || reign.includes('BC')) {
    return -year;
  }
  return year;
}

function groupKingsByEra_New(kings) {
   const eras = {
    'Ancient Period (543 BCE - 250 CE)': [],
    'Classical Period (250 CE - 1017 CE)': [],
    'Medieval Period (1017 CE - 1400 CE)': [],
    'Late Medieval Period (1400 CE - 1600 CE)': [],
    'Colonial Era (1600 CE - 1815 CE)': [],
  };

  kings.forEach(king => {
    const year = extractStartYear_New(king.reign);

    if (year < 250) {
      eras['Ancient Period (543 BCE - 250 CE)'].push(king);
    } else if (year < 1017) {
      eras['Classical Period (250 CE - 1017 CE)'].push(king);
    } else if (year < 1400) {
      eras['Medieval Period (1017 CE - 1400 CE)'].push(king);
    } else if (year < 1600) {
      eras['Late Medieval Period (1400 CE - 1600 CE)'].push(king);
    } else {
      eras['Colonial Era (1600 CE - 1815 CE)'].push(king);
    }
  });

  return eras;
}


console.log('Starting benchmark...');

const ITERATIONS = 1000;

// Benchmark Old (Render simulation)
const startOld = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    // 1. Group kings (simulating inside component)
    const eras = groupKingsByEra_Old(kingsData);

    // 2. Iterate and lookup (simulating rendering)
    Object.values(eras).forEach(eraKings => {
        eraKings.forEach(king => {
             const kingdom = kingdomsData.find(k => k.slug === king.kingdom);
        });
    });
}
const endOld = performance.now();


// Benchmark New (Render simulation)
// Note: In new approach, groupKingsByEra and Map creation happens ONCE (module scope)
// But to be fair, we should measure the cost of that one-time setup + the render loop.
// However, since we are optimizing *render* performance, the setup cost is paid at build/load time.
// I will measure the "per render" cost.

// One time setup
const startSetup = performance.now();
const erasPrecomputed = groupKingsByEra_New(kingsData);
const kingdomMapPrecomputed = new Map(kingdomsData.map(k => [k.slug, k]));
const endSetup = performance.now();

const startNew = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    // 1. Group kings is skipped (precomputed)
    const eras = erasPrecomputed;

    // 2. Iterate and lookup (using Map)
    Object.values(eras).forEach(eraKings => {
        eraKings.forEach(king => {
             const kingdom = kingdomMapPrecomputed.get(king.kingdom);
        });
    });
}
const endNew = performance.now();

console.log(`Old Implementation (Render + Compute): ${endOld - startOld}ms`);
console.log(`New Implementation (Render only): ${endNew - startNew}ms`);
console.log(`New Implementation Setup Cost: ${endSetup - startSetup}ms`);
console.log(`Improvement: ${((endOld - startOld) / (endNew - startNew)).toFixed(2)}x faster per render`);
