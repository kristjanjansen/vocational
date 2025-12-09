#!/usr/bin/env node

import { readJSON, writeJSON } from "./utils/utils.js";
import fs from "fs/promises";

const tahvelSchools = await readJSON("output/01_tahvel_schools.json");
const haridusportaalSchools = await readJSON(
  "output/04_haridusportaal_schools.json"
);

// Normalize school names for comparison (lowercase, trim)
const normalize = (name) => name.toLowerCase().trim();

const tahvelNormalized = new Set(tahvelSchools.map(normalize));
const haridusportaalNormalized = new Set(haridusportaalSchools.map(normalize));

// Use array methods to find matches and differences
const matches = tahvelSchools.filter((school) =>
  haridusportaalNormalized.has(normalize(school))
);

const tahvelOnly = tahvelSchools.filter(
  (school) => !haridusportaalNormalized.has(normalize(school))
);

const haridusportaalOnly = haridusportaalSchools.filter(
  (school) => !tahvelNormalized.has(normalize(school))
);

const comparison = {
  totalTahvel: tahvelSchools.length,
  totalHaridusportaal: haridusportaalSchools.length,
  matches: matches.length,
  tahvelOnly: tahvelOnly.length,
  haridusportaalOnly: haridusportaalOnly.length,
  matchingSchools: matches.sort(),
  tahvelOnlySchools: tahvelOnly.sort(),
  haridusportaalOnlySchools: haridusportaalOnly.sort(),
};

console.log(`Total Tahvel schools: ${comparison.totalTahvel}`);
console.log(`Total Haridusportaal schools: ${comparison.totalHaridusportaal}`);
console.log(`Matching schools: ${comparison.matches}`);
console.log(`Only in Tahvel: ${comparison.tahvelOnly}`);
console.log(`Only in Haridusportaal: ${comparison.haridusportaalOnly}`);

// Generate markdown report using array methods
const report = `# Schools Comparison Report

Generated: ${new Date().toISOString()}

## Summary

- Total Tahvel schools: ${comparison.totalTahvel}
- Total Haridusportaal schools: ${comparison.totalHaridusportaal}
- Exact matches: ${comparison.matches}
- Only in Tahvel: ${comparison.tahvelOnly}
- Only in Haridusportaal: ${comparison.haridusportaalOnly}

## Matching Schools (${comparison.matches})

${comparison.matchingSchools.map((school) => `- ${school}`).join("\n")}

## Only in Tahvel (${comparison.tahvelOnly})

${comparison.tahvelOnlySchools.map((school) => `- ${school}`).join("\n")}

## Only in Haridusportaal (${comparison.haridusportaalOnly})

${comparison.haridusportaalOnlySchools
  .map((school) => `- ${school}`)
  .join("\n")}
`;

await fs.writeFile("output/05_compare_schools.md", report, "utf8");
