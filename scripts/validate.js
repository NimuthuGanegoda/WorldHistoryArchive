#!/usr/bin/env node
/* Validate referential integrity and basic format */
const fs = require('fs');
const path = require('path');

function load(rel){
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname,'..',rel),'utf8'));
  } catch (e) {
    console.error(`Failed to load ${rel}: ${e.message}`);
    return null;
  }
}

const countries = load('src/data/countries.json');

if (!countries) {
  console.error('Could not load countries.json');
  process.exit(1);
}

let errors = [];
let warnings = [];

countries.forEach(country => {
  console.log(`Validating data for ${country.name} (${country.slug})...`);

  const kingdoms = load(`src/data/${country.slug}/kingdoms.json`);
  const kings = load(`src/data/${country.slug}/kings.json`);

  if (!kingdoms || !kings) {
    errors.push(`Missing data files for ${country.slug}`);
    return;
  }

  const kingdomIds = new Set(kingdoms.map(k=>k.slug));

  // Check duplicate slugs for kings
  const slugCounts = new Map();
  for(const king of kings){
    slugCounts.set(king.slug, (slugCounts.get(king.slug)||0)+1);
    if(!king.title || !king.kingdom || (king.reign === undefined)){
      errors.push(`[${country.slug}] Missing required field in king entry: ${JSON.stringify(king)}`);
    }
    if(!kingdomIds.has(king.kingdom)){
      errors.push(`[${country.slug}] King '${king.title}' references unknown kingdom '${king.kingdom}'.`);
    }
    // BCE/CE textual sanity
    if(king.reign && !/BCE|CE|BC|AD/.test(king.reign) && king.reign.length > 0){
      warnings.push(`[${country.slug}] Reign without era marker (BCE/CE): '${king.title}' -> '${king.reign}'`);
    }
  }
  for(const [slug,count] of slugCounts.entries()){
    if(count>1) errors.push(`[${country.slug}] Duplicate king slug '${slug}' count=${count}`);
  }

  // Kingdom era basic pattern
  for(const k of kingdoms){
    if(!k.slug || !k.title){
      errors.push(`[${country.slug}] Kingdom missing slug/title: ${JSON.stringify(k)}`);
    }
    if(!k.reign) warnings.push(`[${country.slug}] Kingdom '${k.slug}' missing reign field.`);
  }
});

if(errors.length){
  console.error('\nValidation FAILED');
  errors.forEach(e=>console.error('ERROR:', e));
  process.exitCode = 1;
}else{
  console.log('Validation PASSED');
}
if(warnings.length){
  console.log('\nWarnings:');
  warnings.forEach(w=>console.log('WARNING:', w));
}
