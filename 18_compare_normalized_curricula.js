#!/usr/bin/env node

import { readJSON, write, unique } from "./utils/utils.js";

// Load both normalized curriculum datasets
const haridusportaalCurricula = await readJSON(
  "output/10_haridusportaal_curricula_normalized.json"
);
const haridusilmCurricula = await readJSON(
  "output/16_haridusilm_curricula_normalized.json"
);

// Extract the normalized names (keys) from both datasets
const haridusportaalNames = new Set(Object.keys(haridusportaalCurricula));
const haridusilmNames = new Set(Object.keys(haridusilmCurricula));

// Find exact matches
const exactMatches = unique(
  [...haridusportaalNames].filter((name) => haridusilmNames.has(name))
);
const onlyInHaridusportaal = unique(
  [...haridusportaalNames].filter((name) => !haridusilmNames.has(name))
);
const onlyInHaridusilm = unique(
  [...haridusilmNames].filter((name) => !haridusportaalNames.has(name))
);

// Generate markdown report
let report = `# Normalized Curriculum Comparison Report

## Overview
- **Haridusportaal curricula**: ${haridusportaalNames.size}
- **Haridusilm curricula**: ${haridusilmNames.size}
- **Exact matches**: ${exactMatches.length}
- **Only in Haridusportaal**: ${onlyInHaridusportaal.length}
- **Only in Haridusilm**: ${onlyInHaridusilm.length}

## Exact Matches (${exactMatches.length})
`;

exactMatches.sort().forEach((name) => {
  report += `- ${name}\n`;
});

report += `\n## Only in Haridusportaal (${onlyInHaridusportaal.length})\n`;
onlyInHaridusportaal.sort().forEach((name) => {
  report += `- ${name}\n`;
});

report += `\n## Only in Haridusilm (${onlyInHaridusilm.length})\n`;
onlyInHaridusilm.sort().forEach((name) => {
  report += `- ${name}\n`;
});

// Calculate match statistics
const matchPercentage = (
  (exactMatches.length /
    Math.max(haridusportaalNames.size, haridusilmNames.size)) *
  100
).toFixed(1);

report += `\n## Statistics\n`;
report += `- **Match rate**: ${matchPercentage}% (based on larger dataset)\n`;
report += `- **Overlap**: ${exactMatches.length} curricula found in both datasets\n`;
report += `- **Haridusportaal coverage**: ${(
  (exactMatches.length / haridusportaalNames.size) *
  100
).toFixed(1)}%\n`;
report += `- **Haridusilm coverage**: ${(
  (exactMatches.length / haridusilmNames.size) *
  100
).toFixed(1)}%\n`;

// Save report to output directory using utils
await write("output/18_compare_normalized_curricula.md", report);

console.log("Report generated: output/18_compare_normalized_curricula.md");
console.log(`\nSummary:`);
console.log(
  `- Total unique curricula: ${
    haridusportaalNames.size + haridusilmNames.size - exactMatches.length
  }`
);
console.log(`- Exact matches: ${exactMatches.length}`);
console.log(`- Only in Haridusportaal: ${onlyInHaridusportaal.length}`);
console.log(`- Only in Haridusilm: ${onlyInHaridusilm.length}`);
console.log(`- Match rate: ${matchPercentage}%`);
