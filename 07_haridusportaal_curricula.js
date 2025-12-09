#!/usr/bin/env node

import { readJSON, writeJSON, files } from "./utils/utils.js";
import path from "path";

const inputDir = "input/06_haridusportaal_curricula";
const curriculaFiles = await files(inputDir);

const allEntities = [];
const seenNids = new Set();
let totalEntities = 0;
let duplicatesRemoved = 0;

for (const file of curriculaFiles) {
  const data = await readJSON(path.join(inputDir, file));

  for (const entity of data.entities) {
    if (!seenNids.has(entity.nid)) {
      seenNids.add(entity.nid);
      allEntities.push(entity);
    } else {
      duplicatesRemoved++;
    }
  }

  totalEntities += data.entities.length;
  console.log(`Loaded ${data.entities.length} entities from ${file}`);
}

const mergedData = {
  entities: allEntities,
  totalCount: allEntities.length,
  sourceFiles: curriculaFiles,
  duplicatesRemoved: duplicatesRemoved,
};

console.log(
  `Merged ${totalEntities} total entities from ${curriculaFiles.length} files`
);
console.log(`Removed ${duplicatesRemoved} duplicates`);
console.log(`Unique entities after merge: ${mergedData.totalCount}`);

await writeJSON("input/07_haridusportaal_curricula.json", mergedData);
