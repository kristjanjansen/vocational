import XLSX from "xlsx";
import { writeJSON } from "./utils/utils.js";

const workbook = XLSX.readFile("./input/downloads/11_haridusilm_students.xlsx");

const firstSheetName = workbook.SheetNames[0];
console.log(`Reading worksheet: ${firstSheetName}`);

const data = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);

console.log(`Found ${data.length} rows in Excel file`);

await writeJSON("./output/11_haridusilm_students.json", data);
