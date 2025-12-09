#!/usr/bin/env node

import { readJSON, writeJSON } from "./utils/utils.js";

const rawData = await readJSON("input/07_haridusportaal_curricula.json");

// Extract curriculum names from raw data, filtering for those with admission dates
const curricula = rawData.entities
  .filter((entity) => entity.fieldAdmissionBeginDate)
  .map((entity) => entity.title.trim());

const normalizeName = (name) => {
  // Remove everything after "(" and remove "(" too
  let normalized = name.split("(")[0].trim();

  // Remove everything after ", spetsialiseerumine" and remove ", spetsialiseerumine" too
  normalized = normalized.split(", spetsialiseerumine")[0].trim();

  // Remove everything after ", spetsialiseerumisega" and remove ", spetsialiseerumisega" too
  normalized = normalized.replace(/,\s*spetsialiseerumisega/gi, "");

  // Remove level indicators like ", tase 2", ", tase 3", etc.
  normalized = normalized.replace(/,\s*tase\s*\d+(\s*esmane kutse)?/gi, "");

  // Remove dots from end of names
  normalized = normalized.replace(/\.$/, "");

  // Normalize vehicle surface care/tire technician variations
  if (normalized.includes("pindade") && normalized.includes("rehvitehnik")) {
    normalized = "Sõidukite pindadehooldaja-rehvitehnik";
  }

  // Normalization mappings
  const normalizationMap = {
    "automaatik-tehnik": "Automaatik",
    "autoplekksepp-komplekteerija": "Autoplekksepp",
    "keevituse- ja metallitööd": "Keevitus- ja metallitööd",
    "kivi- ja betoonkonstruktsioonide ehitus":
      "kivi-ja betoonkonstruktsioonide ehitus",
    "kompositsiooni eriala": "Komponist",
    "kooridirigeerimise eriala": "Koorijuht",
    "kunstnik-kujundaja": "Kujundaja",
    "maaturismi ettevõtlus": "Maaturism",
    "maaturismi teenindus": "Maaturism",
    "majutusteenuste korraldus": "Majutuskorraldus",
    "mehhatroonik-tehnik": "Mehhatroonik",
    "metallitöötlemispinkidel töötleja": "Metallitöötlemispinkidel töötaja",
    "metsanduse spetsialist": "Metsamajanduse spetsialist",
    "multimeedia nooremspetsialist": "Multimeedia spetsialist",
    // "multimeedia spetsialist": "Multimeedium",
    "müüja- klienditeenindaja": "Müüja-klienditeenindaja",
    "õhusõiduki hooldustehnik": "Õhusõiduki tehnik",
    "pagar - kondiiter": "Pagar-kondiiter",
    "pagar kondiiter": "Pagar-kondiiter",
    "pagar-kondiiter": "Pagar-kondiiter",
    "pilli- või lauluõppe juhendaja": "Pilliõppe juhendaja",
    "potsepp-sell": "Pottsepp-sell",
    "puhastusteenindaja-juhendaja": "Puhastusteenindaja juhendaja",
    "puitkonstruktsioonide ehitus": "Puitkonstruktsioonide ehitaja",
    "puittoodete konstrueerija-tehnoloog": "Puittoodete tehnoloog",
    "rätsep- stilist": "Rätsep-stilist",
    //   "rütmimuusika laulmise eriala": "Rütmimuusik",
    //   "rütmimuusika pillide eriala": "Rütmimuusik",
    "sõidukite kere ja värvitööde meister":
      "sõidukite kere- ja värvitööde meister",
    "tarkvara arendus": "Tarkvaraarendaja",
    //   "tekstiiliseadmete operaator": "Tekstiilikäsitööline",
    "tekstiilkäsitöö valmistaja": "Tekstiilikäsitööline",
    //  "telekommunikatsiooni nooremspetsialist":
    "telekommunikatsiooni seadmete spetsialist":
      "telekommunikatsiooni nooremspetsialist",
    // "telekommunikatsiooni vanemtehnik": "Telekommunikatsiooni spetsialist",
    // "vastuvõtu ja majapidamistööde korraldus":
    // meisterjuuksur: "Juuksur",
    autorongijuht: "Autorongi juht",
    bürooassistent: "Sekretär",
    bürootöö: "Sekretär",
    bürootöötaja: "Sekretär",
    ehitusviimitlus: "Ehitusviimistlus",
    hotelliteenindus: "Hotelliteenindaja",
    infoturbespetsialist: "IT-turvaspetsialist",
    keraamik: "Keraamikaesemete valmistaja",
    keraamika: "Keraamikaesemete valmistaja",
    kinnisvarahooldus: "Kinnisvarahooldaja",
    //    kujundusgraafik: "Kujundaja",
    // lihakokk: "Kokk",
    loomakasvatustöötaja: "Loomakasvataja",
    maastikuehitus: "Maastikuehitaja",
    majutusteenindus: "Majutusteenindaja",
    mehhatroonika: "Mehhatroonik",
    // meisteraednik: "Aednik",
    // meisterarborist: "Arborist",
    // meisterflorist: "Florist",
    // meisterkondiiter: "Kondiiter",
    müügikorraldus: "Müügikorraldaja",
    puidupingioperaator: "Puidupingitööline",
    rätsepatöö: "Rätsep-stilist",
    rõivaõmblemine: "Rõivaõmbleja",
    sekretäritöö: "Sekretär",
    sepatöö: "Sepp",
    //  suurköögikokk: "Kokk",
    taimekasvatustootja: "Taimekasvataja",
    tekstiilitöö: "Tekstiilikäsitöö",
    tekstiilkäsitööline: "Tekstiilikäsitöö",
    turismikorraldus: "Turismikorraldaja",
    turismiteenindus: "Turismiettevõtte teenindaja",
    turismiteenused: "Turismiettevõtte teenindaja",
    // vanempagar: "Pagar",
    // vegankokk: "Kokk",
  };

  // Items to remove
  const itemsToRemove = ["kutsevaliku õppekava", "kutsevaliku õpe"];

  // Check if item should be removed
  if (itemsToRemove.includes(normalized.toLowerCase())) {
    return null;
  }

  // Check for CNC prefix
  if (normalized.toLowerCase().startsWith("cnc")) {
    normalized = "CNC operaator";
  } else {
    // Apply normalization mapping
    const mapped = normalizationMap[normalized.toLowerCase()];
    if (mapped) {
      normalized = mapped;
    }
  }

  // If all caps, convert to sentence case, but keep CNC and IT uppercase
  if (normalized === normalized.toUpperCase()) {
    normalized = normalized.toLowerCase();
    // Preserve CNC in uppercase
    normalized = normalized.replace(/cnc/g, "CNC");
    // Preserve IT in uppercase only when not between letters
    normalized = normalized.replace(/(^|\s)it(\s|$)/g, "$1IT$2");
    // Preserve IT- in uppercase at word boundaries
    normalized = normalized.replace(/(^|\s)it-/g, "$1IT-");
    // Preserve APJ in uppercase
    normalized = normalized.replace(/apj/g, "APJ");
    normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  } else {
    // For mixed case names, convert to lowercase first, then apply uppercase preservation
    normalized = normalized.toLowerCase();
    // Preserve CNC in uppercase
    normalized = normalized.replace(/cnc/g, "CNC");
    // Preserve IT in uppercase only when not between letters
    normalized = normalized.replace(/(^|\s)it(\s|$)/g, "$1IT$2");
    // Preserve IT- in uppercase at word boundaries
    normalized = normalized.replace(/(^|\s)it-/g, "$1IT-");
    // Preserve APJ in uppercase
    normalized = normalized.replace(/apj/g, "APJ");
    normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  }

  return normalized;
};

const nameMap = {};

for (const originalName of curricula) {
  const normalized = normalizeName(originalName);

  // Skip null values (removed items)
  if (normalized === null) {
    continue;
  }

  if (!nameMap[normalized]) {
    nameMap[normalized] = [];
  }

  nameMap[normalized].push(originalName);
}

// Sort by normalized name
const sortedNameMap = {};
Object.keys(nameMap)
  .sort()
  .forEach((key) => {
    sortedNameMap[key] = nameMap[key];
  });

await writeJSON("output/10_haridusportaal_curricula_normalized.json", nameMap);

console.log(`Normalized ${Object.keys(nameMap).length} unique curricula`);
