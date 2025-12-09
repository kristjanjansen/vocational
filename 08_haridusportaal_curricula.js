#!/usr/bin/env node

import { readJSON, writeJSON, unique } from "./utils/utils.js";

const data = await readJSON("input/07_haridusportaal_curricula.json");
const curriculumNames = unique(data.entities.map((entity) => entity.title));

console.log(`Extracted ${curriculumNames.length} unique curriculum names`);

await writeJSON("output/08_haridusportaal_curricula.json", curriculumNames);
