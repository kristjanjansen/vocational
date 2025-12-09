#!/usr/bin/env node

import { writeJSON } from "./utils/utils.js";

const output = await fetch(
  "https://tahvel.edu.ee/hois_back/public/curriculumsearch?lang=ET&page=0&size=1000&sort=nameEt,asc&type=3"
);

await writeJSON("input/00_tahvel_curriculumsearch.json", await output.json());
