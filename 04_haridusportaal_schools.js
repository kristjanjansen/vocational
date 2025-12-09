#!/usr/bin/env node

import { readJSON, writeJSON, unique } from "./utils/utils.js";

const data = await readJSON("input/haridusportaal_schools.json");
const schoolTitles = unique(data.entities.map((entity) => entity.title));

await writeJSON("output/04_haridusportaal_schools.json", schoolTitles);
