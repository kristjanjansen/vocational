import { readJSON } from "./utils/utils.js";

// Read both datasets
const studentsData = await readJSON("output/11_haridusilm_students.json");
const curriculaData = await readJSON("output/13_haridusilm_curricula.json");

console.log("Comparing Haridusilm totals for 2024/25 academic year...\n");

// Calculate total students from students dataset
let totalStudents = 0;
for (const row of studentsData) {
  // Skip header row and rows where Õppeaasta contains "Õppeasutus"
  if (row["Õppeaasta"] && !row["Õppeaasta"].includes("Õppeasutus")) {
    const value = row["2024/25"];
    if (typeof value === "number") {
      totalStudents += value;
    }
  }
}

// Calculate total students from curricula dataset
let totalCurriculaStudents = 0;
for (const row of curriculaData) {
  // Skip header row and rows where Õppeaasta is an institution name
  if (row["Õppeaasta"] && !row["Õppeaasta"].includes("Õppeasutus")) {
    const value = row["2024/25"];
    if (typeof value === "number") {
      totalCurriculaStudents += value;
    }
  }
}

console.log(
  `Total students from students dataset (11_haridusilm_students): ${totalStudents.toLocaleString()}`
);
console.log(
  `Total students from curricula dataset (13_haridusilm_curricula): ${totalCurriculaStudents.toLocaleString()}`
);

const difference = totalCurriculaStudents - totalStudents;
const percentageDiff = ((difference / totalStudents) * 100).toFixed(2);

console.log(
  `\nDifference: ${difference.toLocaleString()} (${percentageDiff}%)`
);

if (difference > 0) {
  console.log(
    `The curricula dataset shows ${difference.toLocaleString()} more students (${percentageDiff}% higher)`
  );
} else if (difference < 0) {
  console.log(
    `The curricula dataset shows ${Math.abs(
      difference
    ).toLocaleString()} fewer students (${Math.abs(percentageDiff)}% lower)`
  );
} else {
  console.log("Both datasets show identical totals");
}

// Additional analysis
console.log("\n--- Dataset Summary ---");
console.log(`Students dataset rows: ${studentsData.length}`);
console.log(`Curricula dataset rows: ${curriculaData.length}`);
console.log(
  `Students dataset institutions: ${
    studentsData.filter(
      (r) => r["Õppeaasta"] && !r["Õppeaasta"].includes("Õppeasutus")
    ).length
  }`
);
console.log(
  `Curricula dataset entries: ${
    curriculaData.filter(
      (r) => r["Õppeaasta"] && !r["Õppeaasta"].includes("Õppeasutus")
    ).length
  }`
);
