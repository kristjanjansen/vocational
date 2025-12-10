#!/usr/bin/env node

import { readJSON, writeJSON } from "./utils/utils.js";

// Read the raw Haridusportaal data to get curriculum and school information
const rawData = await readJSON("input/07_haridusportaal_curricula.json");

// Read the normalized curricula lookup table
const normalizedCurricula = await readJSON(
  "output/10_haridusportaal_curricula_normalized.json"
);

// Create a reverse lookup map: original name -> normalized name
const originalToNormalizedMap = {};
for (const [normalizedName, aliases] of Object.entries(normalizedCurricula)) {
  for (const alias of aliases) {
    originalToNormalizedMap[alias.trim()] = normalizedName;
  }
}

// Create a map of normalized name to schools
const curriculumSchoolsMap = {};

// Process each entity in raw data
for (const entity of rawData.entities) {
  // Skip entities without admission date
  if (!entity.fieldAdmissionBeginDate) {
    continue;
  }

  const originalName = entity.title.trim();
  const normalizedName = originalToNormalizedMap[originalName] || originalName;

  // Extract school names from the entity
  const schools = [];
  if (entity.fieldEducationalInstitution) {
    for (const [schoolId, schoolData] of Object.entries(
      entity.fieldEducationalInstitution
    )) {
      if (schoolData.title) {
        // School name is in the 'title' field
        schools.push(schoolData.title);
      }
    }
  }

  // Add schools to the normalized curriculum entry (avoid duplicates)
  if (!curriculumSchoolsMap[normalizedName]) {
    curriculumSchoolsMap[normalizedName] = new Set();
  }
  schools.forEach((school) => {
    if (school) {
      curriculumSchoolsMap[normalizedName].add(school.trim());
    }
  });
}

// Convert to the desired array format
const result = [];
for (const [normalizedName, schoolSet] of Object.entries(
  curriculumSchoolsMap
)) {
  result.push({
    name: normalizedName,
    schools: Array.from(schoolSet).sort(), // Convert Set to array and sort
  });
}

// Sort by curriculum name
result.sort((a, b) => a.name.localeCompare(b.name));

// Save the result
await writeJSON(
  "output/50_haridusportaal_curricula_with_normalized.json",
  result
);

console.log(
  `Generated ${result.length} normalized curricula with school information`
);

// Show some statistics
const totalSchools = result.reduce((sum, item) => sum + item.schools.length, 0);
const avgSchools = (totalSchools / result.length).toFixed(2);
console.log(`Total unique school-curriculum combinations: ${totalSchools}`);
console.log(`Average schools per curriculum: ${avgSchools}`);

// Show how many were normalized vs kept original
let normalizedCount = 0;
let originalCount = 0;
for (const item of result) {
  // Check if this normalized name exists in our lookup table
  if (normalizedCurricula[item.name]) {
    normalizedCount++;
  } else {
    originalCount++;
  }
}
console.log(`Curricula with normalized names: ${normalizedCount}`);
console.log(`Curricula kept with original names: ${originalCount}`);
