#!/usr/bin/env node

import { writeJSON } from "./utils/utils.js";

for (let offset = 0; offset <= 4000; offset += 10) {
  const output = await fetch(
    `https://api.hp.edu.ee/api/list?_format=json&content_type=study_programme&study_programme_type=644&offset=${offset}`
  );

  const data = await output.json();
  console.log(`Fetched ${data.entities.length} entities at offset ${offset}`);

  await writeJSON(
    `input/06_haridusportaal_curricula/haridusportaal_curricula_${offset}.json`,
    data
  );
}
