#!/usr/bin/env node

import { readJSON, writeJSON } from "./utils/utils.js";
import fs from "fs/promises";

const rawHaridusportaalData = await readJSON(
  "input/07_haridusportaal_curricula.json"
);
const tahvelCurricula = await readJSON("output/02_tahvel_curricula.json");

// Filter Haridusportaal curricula to only include those with fieldAdmissionBeginDate
const haridusportaalCurricula = [
  ...new Set(
    rawHaridusportaalData.entities
      .filter((entity) => entity.fieldAdmissionBeginDate)
      .map((entity) => entity.title.trim())
  ),
];

// Normalize curriculum names for comparison (lowercase, trim)
const normalize = (name) => name.toLowerCase().trim();

const tahvelNormalized = new Set(tahvelCurricula.map(normalize));
const haridusportaalNormalized = new Set(
  haridusportaalCurricula.map(normalize)
);

// Find matches and differences
const matches = [];
const tahvelOnly = [];
const haridusportaalOnly = [];

// Check Tahvel curricula
for (const curriculum of tahvelCurricula) {
  const normalized = normalize(curriculum);
  if (haridusportaalNormalized.has(normalized)) {
    matches.push(curriculum);
  } else {
    tahvelOnly.push(curriculum);
  }
}

// Check Haridusportaal curricula
for (const curriculum of haridusportaalCurricula) {
  const normalized = normalize(curriculum);
  if (!tahvelNormalized.has(normalized)) {
    haridusportaalOnly.push(curriculum);
  }
}

const comparison = {
  totalTahvel: tahvelCurricula.length,
  totalHaridusportaal: rawHaridusportaalData.entities.length,
  totalHaridusportaalWithAdmissionDates: haridusportaalCurricula.length,
  matches: matches.length,
  tahvelOnly: tahvelOnly.length,
  haridusportaalOnly: haridusportaalOnly.length,
  matchingCurricula: matches,
  tahvelOnlyCurricula: tahvelOnly,
  haridusportaalOnlyCurricula: haridusportaalOnly,
};

console.log(`Total Tahvel curricula: ${comparison.totalTahvel}`);
console.log(
  `Total Haridusportaal curricula: ${comparison.totalHaridusportaal}`
);
console.log(
  `Haridusportaal curricula with admission dates (unique): ${comparison.totalHaridusportaalWithAdmissionDates}`
);
console.log(`Matching curricula: ${comparison.matches}`);
console.log(`Only in Tahvel: ${comparison.tahvelOnly}`);
console.log(`Only in Haridusportaal: ${comparison.haridusportaalOnly}`);

// Generate markdown report
let report = "# Curricula Comparison Report\n\n";
report += `Generated: ${new Date().toISOString()}\n\n`;

report += `## Summary\n\n`;
report += `- Total Tahvel curricula: ${comparison.totalTahvel}\n`;
report += `- Total Haridusportaal curricula: ${comparison.totalHaridusportaal}\n`;
report += `- Haridusportaal curricula with admission dates (unique): ${comparison.totalHaridusportaalWithAdmissionDates}\n`;
report += `- Exact matches: ${comparison.matches}\n`;
report += `- Only in Tahvel: ${comparison.tahvelOnly}\n`;
report += `- Only in Haridusportaal: ${comparison.haridusportaalOnly}\n\n`;

report += `## Exact Matches (${comparison.matches})\n\n`;
for (const match of matches.sort()) {
  report += `- ${match}\n`;
}

report += `\n## Only in Tahvel (${comparison.tahvelOnly})\n\n`;
for (const curriculum of tahvelOnly.sort()) {
  report += `- ${curriculum}\n`;
}

report += `\n## Only in Haridusportaal (${comparison.haridusportaalOnly})\n\n`;
for (const curriculum of haridusportaalOnly.sort()) {
  report += `- ${curriculum}\n`;
}

// Save markdown report
await fs.writeFile("output/09_compare_curricula.md", report, "utf8");
