#!/usr/bin/env node

import { writeJSON } from "./utils/utils.js";

const output = await fetch(
  "https://api.hp.edu.ee/api/list?_format=json&content_type=school&primaryTypes=2364&title=&bounds=&minLat=0&maxLat=99&minLon=0&maxLon=99&location=&language=&ownership=&specialClass=&studentHome=&content_type=school&lang=ET&offset=0&limit=50"
);

await writeJSON("input/03_haridusportaal_schools.json", await output.json());
