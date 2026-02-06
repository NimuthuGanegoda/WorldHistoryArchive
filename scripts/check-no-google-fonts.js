#!/usr/bin/env node

/**
 * Pre-build check: Ensure no Google Fonts are imported
 * 
 * This prevents build failures in restricted network environments
 * where fonts.googleapis.com is not accessible.
 * 
 * Use Tailwind system fonts instead: className="font-sans"
 */

const fs = require('fs');
const path = require('path');

const patterns = [
  /from ['"]next\/font\/google['"]/,
  /import.*next\/font\/google/,
  /@import.*fonts\.googleapis\.com/,
  /fonts\.googleapis\.com/
];

const excludeDirs = ['node_modules', '.next', 'out', '.git'];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];
  
  patterns.forEach((pattern) => {
    if (pattern.test(content)) {
      errors.push({
        file: filePath,
        pattern: pattern.toString(),
        line: findLineNumber(content, pattern)
      });
    }
  });
  
  return errors;
}

function findLineNumber(content, pattern) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      return i + 1;
    }
  }
  return -1;
}

function walkDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        walkDirectory(filePath, fileList);
      }
    } else if (file.match(/\.(tsx?|jsx?|css)$/)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function main() {
  const srcDir = path.join(process.cwd(), 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('Error: src directory not found');
    process.exit(1);
  }
  
  const files = walkDirectory(srcDir);
  let allErrors = [];
  
  files.forEach(file => {
    const errors = checkFile(file);
    allErrors = allErrors.concat(errors);
  });
  
  if (allErrors.length > 0) {
    console.error('\n❌ Google Fonts detected! This will cause build failures.\n');
    console.error('Found Google Fonts imports in the following files:\n');
    
    allErrors.forEach(error => {
      console.error(`  ${error.file}:${error.line}`);
      console.error(`  Pattern: ${error.pattern}\n`);
    });
    
    console.error('✅ Solution: Use Tailwind system fonts instead:');
    console.error('   - Remove: import { Inter } from "next/font/google"');
    console.error('   - Use: className="font-sans" (Tailwind system fonts)\n');
    
    process.exit(1);
  }
  
  console.log('✅ No Google Fonts detected. Build can proceed safely.');
  process.exit(0);
}

main();
