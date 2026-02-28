// scripts/copy-cname.js
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../public/CNAME');
const dest = path.join(__dirname, '../out/CNAME');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('CNAME copied to /out directory.');
} else {
  console.error('CNAME file not found in /public.');
  process.exit(1);
}
