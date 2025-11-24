const fs = require('fs');
const path = require('path');

// Convert index.html to JSON
function convertIndexPage(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  
  const data = {
    page: 'home',
    title: 'Kingdoms of Sri Lanka',
    subtitle: 'Explore the rich history and heritage of Sri Lankan kingdoms from ancient times to the colonial era.',
    kingdoms: []
  };
  
  // Extract kingdom cards
  const kingdomCards = html.match(/<a href="kingdoms\/(.*?)\.html" class="kingdom-card">.*?<h3>(.*?)<\/h3>.*?<p class="period">(.*?)<\/p>.*?<p>(.*?)<\/p>.*?<\/a>/gs);
  
  if (kingdomCards) {
    kingdomCards.forEach(card => {
      const slugMatch = card.match(/href="kingdoms\/(.*?)\.html"/);
      const nameMatch = card.match(/<h3>(.*?)<\/h3>/);
      const periodMatch = card.match(/<p class="period">(.*?)<\/p>/);
      const descMatch = card.match(/<\/p>\s*<p>(.*?)<\/p>\s*<\/a>/);
      
      if (slugMatch && nameMatch) {
        data.kingdoms.push({
          slug: slugMatch[1],
          name: nameMatch[1],
          period: periodMatch ? periodMatch[1] : '',
          description: descMatch ? descMatch[1] : ''
        });
      }
    });
  }
  
  return data;
}

// Convert kingdoms.html list page
function convertKingdomsListPage(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  
  const data = {
    page: 'kingdoms-list',
    title: 'Kingdoms of Sri Lanka',
    subtitle: 'Browse all historical kingdoms that ruled Sri Lanka',
    kingdoms: []
  };
  
  const kingdomCards = html.match(/<a href="kingdoms\/(.*?)\.html" class="kingdom-card">.*?<h3>(.*?)<\/h3>.*?<p class="period">(.*?)<\/p>.*?<p>(.*?)<\/p>.*?<\/a>/gs);
  
  if (kingdomCards) {
    kingdomCards.forEach(card => {
      const slugMatch = card.match(/href="kingdoms\/(.*?)\.html"/);
      const nameMatch = card.match(/<h3>(.*?)<\/h3>/);
      const periodMatch = card.match(/<p class="period">(.*?)<\/p>/);
      const descMatch = card.match(/<\/p>\s*<p>(.*?)<\/p>\s*<\/a>/);
      
      if (slugMatch && nameMatch) {
        data.kingdoms.push({
          slug: slugMatch[1],
          name: nameMatch[1],
          period: periodMatch ? periodMatch[1] : '',
          description: descMatch ? descMatch[1] : ''
        });
      }
    });
  }
  
  return data;
}

// Convert kings.html list page
function convertKingsListPage(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  
  const data = {
    page: 'kings-list',
    title: 'Kings and Queens of Sri Lanka',
    subtitle: 'Complete list of monarchs who ruled Sri Lanka',
    kings: []
  };
  
  // Extract king entries from table or list
  const kingRows = html.match(/<tr>.*?<td><a href="kings\/(.*?)\.html">(.*?)<\/a><\/td>.*?<td>(.*?)<\/td>.*?<td>(.*?)<\/td>.*?<\/tr>/gs);
  
  if (kingRows) {
    kingRows.forEach(row => {
      const slugMatch = row.match(/href="kings\/(.*?)\.html"/);
      const nameMatch = row.match(/<a href="kings\/.*?\.html">(.*?)<\/a>/);
      const reignMatch = row.match(/<\/td>\s*<td>(.*?)<\/td>\s*<td>/);
      const kingdomMatch = row.match(/<td>[^<]*<\/td>\s*<td>(.*?)<\/td>\s*<\/tr>/);
      
      if (slugMatch && nameMatch) {
        data.kings.push({
          slug: slugMatch[1],
          name: nameMatch[1],
          reign: reignMatch ? reignMatch[1] : '',
          kingdom: kingdomMatch ? kingdomMatch[1] : ''
        });
      }
    });
  }
  
  // Fallback: try to extract from card layout if table doesn't exist
  if (data.kings.length === 0) {
    const kingCards = html.match(/<a href="kings\/(.*?)\.html"[^>]*>.*?<h3>(.*?)<\/h3>.*?<\/a>/gs);
    if (kingCards) {
      kingCards.forEach(card => {
        const slugMatch = card.match(/href="kings\/(.*?)\.html"/);
        const nameMatch = card.match(/<h3>(.*?)<\/h3>/);
        
        if (slugMatch && nameMatch) {
          data.kings.push({
            slug: slugMatch[1],
            name: nameMatch[1]
          });
        }
      });
    }
  }
  
  return data;
}

// Convert sites.html
function convertSitesPage(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  
  const data = {
    page: 'sites',
    title: 'Historical Sites',
    subtitle: 'Important archaeological and cultural sites in Sri Lanka',
    sites: []
  };
  
  const siteCards = html.match(/<a href="sites\/(.*?)\.html" class="[^"]*">.*?<h3>(.*?)<\/h3>.*?<p>(.*?)<\/p>.*?<\/a>/gs);
  
  if (siteCards) {
    siteCards.forEach(card => {
      const slugMatch = card.match(/href="sites\/(.*?)\.html"/);
      const nameMatch = card.match(/<h3>(.*?)<\/h3>/);
      const descMatch = card.match(/<\/h3>\s*<p>(.*?)<\/p>/);
      
      if (slugMatch && nameMatch) {
        data.sites.push({
          slug: slugMatch[1],
          name: nameMatch[1],
          description: descMatch ? descMatch[1] : ''
        });
      }
    });
  }
  
  return data;
}

// Main execution
const htmlOutputDir = path.join(__dirname, '..', 'html-output');
const jsonOutputDir = path.join(__dirname, '..', 'json-output');

console.log('Converting remaining HTML files to JSON...\n');

// Convert index.html
if (fs.existsSync(path.join(htmlOutputDir, 'index.html'))) {
  const indexData = convertIndexPage(path.join(htmlOutputDir, 'index.html'));
  fs.writeFileSync(
    path.join(jsonOutputDir, 'index.json'),
    JSON.stringify(indexData, null, 2)
  );
  console.log('✅ Created index.json');
}

// Convert kingdoms.html
if (fs.existsSync(path.join(htmlOutputDir, 'kingdoms.html'))) {
  const kingdomsData = convertKingdomsListPage(path.join(htmlOutputDir, 'kingdoms.html'));
  fs.writeFileSync(
    path.join(jsonOutputDir, 'kingdoms-list.json'),
    JSON.stringify(kingdomsData, null, 2)
  );
  console.log('✅ Created kingdoms-list.json');
}

// Convert kings.html
if (fs.existsSync(path.join(htmlOutputDir, 'kings.html'))) {
  const kingsData = convertKingsListPage(path.join(htmlOutputDir, 'kings.html'));
  fs.writeFileSync(
    path.join(jsonOutputDir, 'kings-list.json'),
    JSON.stringify(kingsData, null, 2)
  );
  console.log('✅ Created kings-list.json');
}

// Convert sites.html
if (fs.existsSync(path.join(htmlOutputDir, 'sites.html'))) {
  const sitesData = convertSitesPage(path.join(htmlOutputDir, 'sites.html'));
  fs.writeFileSync(
    path.join(jsonOutputDir, 'sites.json'),
    JSON.stringify(sitesData, null, 2)
  );
  console.log('✅ Created sites.json');
}

console.log('\n✅ All HTML files converted to JSON!');
console.log(`JSON files location: ${jsonOutputDir}`);
