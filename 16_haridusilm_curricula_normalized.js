#!/usr/bin/env node

import { readJSON, writeJSON } from "./utils/utils.js";
import { createCurriculumNameMap } from "./utils/data.js";

async function main() {
  try {
    // Load haridusilm curricula data
    const haridusilmData = await readJSON(
      "output/13_haridusilm_curricula.json"
    );

    // Extract curriculum names from haridusilm data (skip header and ignore "Õppeasutus" values)
    const haridusilmCurricula = [];
    for (const item of haridusilmData.slice(1)) {
      const curriculumName = item["__EMPTY_2"] || "";

      if (curriculumName && curriculumName !== "Õppeasutus") {
        haridusilmCurricula.push(curriculumName.trim());
      }
    }

    console.log(
      `Found ${haridusilmCurricula.length} curriculum entries from Haridusilm`
    );

    // Create normalized name map using the utility function
    const normalizedCurricula = createCurriculumNameMap(haridusilmCurricula);

    // Save normalized data
    await writeJSON(
      "output/16_haridusilm_curricula_normalized.json",
      normalizedCurricula
    );

    console.log(
      `Normalized ${
        Object.keys(normalizedCurricula).length
      } unique curricula from Haridusilm`
    );
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
