#!/usr/bin/env node
// Wrapper to call CLI export-markdown directly (for npm script convenience)
const { spawnSync } = require('node:child_process');
const dir = process.argv[2] || 'output-md';
const res = spawnSync('node',['src/cli.js','export-markdown',dir],{stdio:'inherit'});
process.exitCode = res.status;
