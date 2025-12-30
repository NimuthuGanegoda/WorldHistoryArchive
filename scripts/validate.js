#!/usr/bin/env node
/* Validate referential integrity and basic format */
const fs = require('fs');
const path = require('path');

function load(rel){
  return JSON.parse(fs.readFileSync(path.join(__dirname,'..',rel),'utf8'));
}

const kingdoms = load('data/kingdoms.json');
const kings = load('data/kings.json');

const kingdomIds = new Set(kingdoms.map(k=>k.id));
let errors = [];
let warnings = [];

// Check duplicate slugs for kings
const slugCounts = new Map();
for(const king of kings){
  slugCounts.set(king.slug, (slugCounts.get(king.slug)||0)+1);
  if(!king.name || !king.kingdom || !king.reign){
    errors.push(`Missing required field in king entry: ${JSON.stringify(king)}`);
  }
  if(!kingdomIds.has(king.kingdom)){
    errors.push(`King '${king.name}' references unknown kingdom '${king.kingdom}'.`);
  }
  // BCE/CE textual sanity
  if(!/BCE|CE/.test(king.reign)){
    warnings.push(`Reign without era marker (BCE/CE): '${king.name}' -> '${king.reign}'`);
  }
}
for(const [slug,count] of slugCounts.entries()){
  if(count>1) errors.push(`Duplicate king slug '${slug}' count=${count}`);
}

// Kingdom era basic pattern
for(const k of kingdoms){
  if(!k.id || !k.name){
    errors.push(`Kingdom missing id/name: ${JSON.stringify(k)}`);
  }
  if(!k.era) warnings.push(`Kingdom '${k.id}' missing era field.`);
}

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
