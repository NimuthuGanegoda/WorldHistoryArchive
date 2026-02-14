
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const tempDir = path.join(__dirname, '../temp_test');
const utilsSrc = path.join(__dirname, '../src/lib/utils.ts');
const utilsDist = path.join(tempDir, 'utils.js');
const kingsDataPath = path.join(__dirname, '../src/data/kings.json');

// Ensure temp dir exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

try {
  console.log('Compiling src/lib/utils.ts...');
  // We use npx tsc to compile just the utils file.
  // We need --esModuleInterop to handle default exports if any (though utils uses named exports).
  // We need --skipLibCheck to ignore lib errors.
  execSync(`npx tsc "${utilsSrc}" --outDir "${tempDir}" --noEmit false --module commonjs --target es2017 --skipLibCheck --esModuleInterop`, { stdio: 'inherit' });

  console.log('Loading compiled module...');
  // We need to handle the fact that tsc might output to a subfolder structure if not careful,
  // but with a single file and outDir it usually puts it directly or mirroring source.
  // Let's check where it went.
  // If src/lib/utils.ts is compiled with outDir temp_test, it might go to temp_test/utils.js or temp_test/src/lib/utils.js
  // Let's check.

  let compiledPath = utilsDist;
  if (!fs.existsSync(utilsDist)) {
     // Try looking for it
     const recursiveFind = (dir) => {
         const files = fs.readdirSync(dir);
         for (const file of files) {
             const fp = path.join(dir, file);
             if (fs.statSync(fp).isDirectory()) {
                 const found = recursiveFind(fp);
                 if (found) return found;
             } else if (file === 'utils.js') {
                 return fp;
             }
         }
         return null;
     };
     compiledPath = recursiveFind(tempDir);
  }

  if (!compiledPath) {
      throw new Error('Could not find compiled utils.js');
  }

  console.log(`Found compiled file at ${compiledPath}`);
  const { getDailyKings } = require(compiledPath);

  const kingsData = JSON.parse(fs.readFileSync(kingsDataPath, 'utf8'));
  console.log(`Loaded ${kingsData.length} kings.`);

  // Test Logic
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  console.log(`\nTesting rotation logic:`);

  const todayKings = getDailyKings(kingsData, 6, today);
  const todayKings2 = getDailyKings(kingsData, 6, today); // Should be same
  const tomorrowKings = getDailyKings(kingsData, 6, tomorrow);
  const yesterdayKings = getDailyKings(kingsData, 6, yesterday);

  // 1. Determinism Check
  const todaySlugs = todayKings.map(k => k.slug).join(',');
  const todaySlugs2 = todayKings2.map(k => k.slug).join(',');

  if (todaySlugs !== todaySlugs2) {
      console.error('FAIL: Determinism check failed. Same date produced different kings.');
      process.exit(1);
  }
  console.log('PASS: Determinism check (Same date -> Same kings).');

  // 2. Rotation Check
  const tomorrowSlugs = tomorrowKings.map(k => k.slug).join(',');

  if (todaySlugs === tomorrowSlugs) {
      console.error('FAIL: Rotation check failed. Today and Tomorrow have same kings.');
      // Note: Extremely unlikely to happen by chance (1 in billions).
      process.exit(1);
  }
  console.log('PASS: Rotation check (Different date -> Different kings).');

  // 3. Yesterday Check
  const yesterdaySlugs = yesterdayKings.map(k => k.slug).join(',');
  if (todaySlugs === yesterdaySlugs) {
      console.error('FAIL: Rotation check failed. Today and Yesterday have same kings.');
      process.exit(1);
  }
  console.log('PASS: Rotation check (Yesterday != Today).');

  console.log('\nAll checks passed successfully.');

} catch (error) {
  console.error('Error running verification script:', error);
  process.exit(1);
} finally {
  // Cleanup
  try {
      if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
          console.log('Cleaned up temp directory.');
      }
  } catch (e) {
      console.error('Error cleaning up:', e);
  }
}
