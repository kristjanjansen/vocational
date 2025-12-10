#!/usr/bin/env node

import { readJSON, write } from "./utils/utils.js";

async function main() {
  try {
    // Load data from files
    const haridusportaalSchools = await readJSON(
      "output/04_haridusportaal_schools.json"
    );
    const haridusilmData = await readJSON("output/11_haridusilm_students.json");

    // Extract school names from haridusilm data (skip header and summary rows)
    const haridusilmSchools = [];
    for (const item of haridusilmData.slice(1)) {
      const schoolName = item["Õppeaasta"] || "";
      if (
        schoolName &&
        schoolName !== "Õppeasutus" &&
        schoolName !== "Total" &&
        !schoolName.includes("Applied filters")
      ) {
        haridusilmSchools.push(schoolName);
      }
    }

    // Find exact matches (no normalization)
    const exactMatches = [];
    const onlyInHaridusportaal = [];
    const onlyInHaridusilm = [];

    // Create sets for quick lookup
    const haridusilmSet = new Set(haridusilmSchools);

    haridusportaalSchools.forEach((school) => {
      if (haridusilmSet.has(school)) {
        exactMatches.push(school);
      } else {
        onlyInHaridusportaal.push(school);
      }
    });

    haridusilmSchools.forEach((school) => {
      if (!haridusportaalSchools.includes(school)) {
        onlyInHaridusilm.push(school);
      }
    });

    // Generate markdown report
    let report = `# School Name Comparison Report

## Overview
- **Haridusportaal schools**: ${haridusportaalSchools.length}
- **Haridusilm schools**: ${haridusilmSchools.length}
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

    // Save report to output directory using utils
    await write("output/15_haridusportaal_haridusilm_schools.md", report);

    console.log(
      "Report generated: output/15_haridusportaal_haridusilm_schools.md"
    );
    console.log(`\nSummary:`);
    console.log(
      `- Total schools compared: ${
        haridusportaalSchools.length + haridusilmSchools.length
      }`
    );
    console.log(`- Exact matches: ${exactMatches.length}`);
    console.log(
      `- Schools only in Haridusportaal: ${onlyInHaridusportaal.length}`
    );
    console.log(`- Schools only in Haridusilm: ${onlyInHaridusilm.length}`);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
