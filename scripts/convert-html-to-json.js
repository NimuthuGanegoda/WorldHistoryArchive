const fs = require('fs');
const path = require('path');

// Simple HTML to JSON converter
function htmlToJson(htmlContent, slug) {
  const data = {
    slug: slug,
    title: '',
    reign: '',
    kingdom: '',
    biography: '',
    sections: []
  };
  
  // Extract title
  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);
  data.title = titleMatch ? titleMatch[1].replace(' - Sri Lanka History', '').trim() : '';
  
  // Extract hero/header content
  const heroMatch = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/);
  if (heroMatch) {
    data.title = heroMatch[1].trim();
  }
  
  // Extract reign info if present
  const reignMatch = htmlContent.match(/Reign:\s*([^<]+)/);
  if (reignMatch) {
    data.reign = reignMatch[1].trim();
  }
  
  // Extract kingdom info if present
  const kingdomMatch = htmlContent.match(/Kingdom:\s*<\/span>\s*([^<]+)/);
  if (kingdomMatch) {
    data.kingdom = kingdomMatch[1].trim();
  }
  
  // Extract period for kingdoms
  const periodMatch = htmlContent.match(/<p class="period">([^<]+)<\/p>/);
  if (periodMatch) {
    data.reign = periodMatch[1].trim();
  }
  
  // Extract all content sections
  const contentSections = htmlContent.match(/<div class="content-section">(.*?)<\/div>\s*<\/div>/gs);
  
  if (contentSections) {
    contentSections.forEach(section => {
      const sectionData = {
        heading: '',
        content: [],
        infoBoxes: []
      };
      
      // Extract section title
      const sectionTitleMatch = section.match(/<h2>(.*?)<\/h2>/);
      if (sectionTitleMatch) {
        sectionData.heading = sectionTitleMatch[1].trim();
      }
      
      // Extract paragraphs
      const paragraphs = section.match(/<p(?![^>]*class="period")>(.*?)<\/p>/gs);
      if (paragraphs) {
        paragraphs.forEach(p => {
          const text = p.replace(/<\/?p>/g, '').trim();
          if (text && !text.includes('class=')) {
            sectionData.content.push(text);
            // Also add to biography if it's the Biography section
            if (sectionData.heading === 'Biography' || sectionData.heading === 'Overview' || sectionData.heading === 'History') {
              data.biography += text + ' ';
            }
          }
        });
      }
      
      // Extract info boxes
      const infoBoxes = section.match(/<div class="info-box">.*?<\/div>/gs);
      if (infoBoxes) {
        infoBoxes.forEach(box => {
          const strongMatch = box.match(/<strong>(.*?)<\/strong>/);
          const pMatch = box.match(/<p>(.*?)<\/p>/);
          if (strongMatch && pMatch) {
            sectionData.infoBoxes.push({
              title: strongMatch[1].trim(),
              content: pMatch[1].trim()
            });
          }
        });
      }
      
      data.sections.push(sectionData);
    });
  }
  
  // Clean up biography
  data.biography = data.biography.trim();
  
  return data;
}

// Convert all HTML files in a directory to a single JSON array
function convertDirectoryToJson(inputDir, outputFile, type) {
  const files = fs.readdirSync(inputDir);
  const results = [];
  
  files.forEach(file => {
    if (file.endsWith('.html')) {
      const inputPath = path.join(inputDir, file);
      const htmlContent = fs.readFileSync(inputPath, 'utf8');
      const slug = file.replace('.html', '');
      const jsonData = htmlToJson(htmlContent, slug);
      results.push(jsonData);
      console.log(`Converted: ${file}`);
    }
  });
  
  // Sort by title
  results.sort((a, b) => a.title.localeCompare(b.title));
  
  return results;
}

// Main execution
const htmlOutputDir = path.join(__dirname, '..', 'html-output');
const jsonOutputDir = path.join(__dirname, '..', 'json-output');

console.log('Converting HTML files to JSON...\n');

// Create output directory
if (!fs.existsSync(jsonOutputDir)) {
  fs.mkdirSync(jsonOutputDir, { recursive: true });
}

// Convert kings
console.log('Converting kings...');
const kings = convertDirectoryToJson(
  path.join(htmlOutputDir, 'kings'), 
  path.join(jsonOutputDir, 'kings.json'),
  'king'
);
fs.writeFileSync(
  path.join(jsonOutputDir, 'kings.json'), 
  JSON.stringify(kings, null, 2)
);
console.log(`✅ Created kings.json with ${kings.length} entries\n`);

// Convert kingdoms
console.log('Converting kingdoms...');
const kingdoms = convertDirectoryToJson(
  path.join(htmlOutputDir, 'kingdoms'), 
  path.join(jsonOutputDir, 'kingdoms.json'),
  'kingdom'
);
fs.writeFileSync(
  path.join(jsonOutputDir, 'kingdoms.json'), 
  JSON.stringify(kingdoms, null, 2)
);
console.log(`✅ Created kingdoms.json with ${kingdoms.length} entries\n`);

// Create a combined file
const combined = {
  meta: {
    title: "Sri Lanka History Data",
    description: "Historical kingdoms and monarchs of Sri Lanka",
    generated: new Date().toISOString(),
    totalKings: kings.length,
    totalKingdoms: kingdoms.length
  },
  kingdoms: kingdoms,
  kings: kings
};

fs.writeFileSync(
  path.join(jsonOutputDir, 'complete.json'), 
  JSON.stringify(combined, null, 2)
);
console.log(`✅ Created complete.json with all data\n`);

console.log('✅ Conversion complete!');
console.log(`JSON files saved to: ${jsonOutputDir}`);
