import fetch from "node-fetch";
import Papa from "papaparse";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const sheetId = process.env.SHEET_ID;

// Throw an error if the variable is not set
if (!sheetId) {
  throw new Error("SHEET_ID environment variable is not set.");
}

// The rest of your script remains the same
const sheetUrl = `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?output=csv`;
const outputDir = path.resolve("./data");
const outputFile = path.join(outputDir, "user-data.json");

if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

// Fetch CSV
const res = await fetch(sheetUrl);
if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.statusText}`);
const csvText = await res.text();

// Parse CSV without header first to see the actual structure
const { data: allRows } = Papa.parse(csvText, { skipEmptyLines: true });

// The first row should be the header
const headers = allRows[0];
const dataRows = allRows.slice(1);

console.log("Headers:", headers);

// Map the headers to more readable names based on your spreadsheet structure
const headerMap = {
  0: 'Type',
  1: 'description',
  2: 'color',
  3: 'image',
  4: 'questionType',
  5: 'question',
  6: 'Options',
  7: 'Min',
  8: 'Max'
};

// Convert rows to objects with proper field names
const rows = dataRows.map(row => {
  const obj = {};
  for (let i = 0; i < headers.length; i++) {
    const fieldName = headerMap[i] || `field_${i}`;
    obj[fieldName] = row[i] || '';
  }
  return obj;
});

// Variables to keep track of the last non-empty values
let lastType = "";
let lastDescription = "";
let lastColor = "";
let lastImage = "";

// Group by Type column
const grouped = {};

rows.forEach(row => {
  if (row.Type && row.Type.trim() !== "") lastType = row.Type;
  if (row.description && row.description.trim() !== "") lastDescription = row.description;
  if (row.color && row.color.trim() !== "") lastColor = row.color;
  if (row.image && row.image.trim() !== "") lastImage = row.image;

  const currentType = lastType || "Unknown";

  if (!grouped[currentType]) {
    grouped[currentType] = {
      type: currentType,
      description: lastDescription,
      color: lastColor,
      image: lastImage,
      questions: []
    };
  }

  const question = {
    questionType: row.questionType || "",
    question: row.question || "",
    min: row.Min || "",
    max: row.Max || ""
  };

  if (row.Options) {
    question.options = row.Options.split("|").map(opt => {
      const [value, label] = opt.split(":").map(s => s.trim());
      return { value, label };
    });
  }

  if (question.question) {
    grouped[currentType].questions.push(question);
  }
});

const result = Object.values(grouped);
writeFileSync(outputFile, JSON.stringify(result, null, 2), "utf-8");