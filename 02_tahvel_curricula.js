#!/usr/bin/env node

import { readJSON, writeJSON, unique } from "./utils/utils.js";

const data = await readJSON("input/00_tahvel_curriculumsearch.json");
const curriculaTitles = unique(data.content.map((item) => item.nameEt));

await writeJSON("output/02_tahvel_curricula.json", curriculaTitles);
