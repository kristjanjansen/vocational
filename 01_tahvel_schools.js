#!/usr/bin/env node

import { readJSON, writeJSON, unique } from "./utils/utils.js";

const data = await readJSON("input/00_tahvel_curriculumsearch.json");
const output = unique(data.content.map((item) => item.school.nameEt));

await writeJSON("output/01_tahvel_schools.json", output);
