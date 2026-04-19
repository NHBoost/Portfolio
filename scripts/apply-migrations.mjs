#!/usr/bin/env node
// Applies SQL files to Supabase via the Management API.
// Usage:
//   SUPABASE_ACCESS_TOKEN=sbp_... SUPABASE_PROJECT_REF=xxxx \
//     node scripts/apply-migrations.mjs path/to/file.sql [more.sql ...]

import { readFileSync } from "node:fs";
import { basename } from "node:path";

const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = process.env.SUPABASE_PROJECT_REF;

if (!token || !ref) {
  console.error("Missing SUPABASE_ACCESS_TOKEN or SUPABASE_PROJECT_REF env.");
  process.exit(1);
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node apply-migrations.mjs <file.sql> [...]");
  process.exit(1);
}

const endpoint = `https://api.supabase.com/v1/projects/${ref}/database/query`;

async function run(sql, label) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`\n[${label}] FAILED (${res.status})`);
    console.error(text);
    process.exit(1);
  }
  console.log(`[${label}] ok`);
}

for (const file of files) {
  const sql = readFileSync(file, "utf8");
  console.log(`\nApplying ${file} (${sql.length} chars)`);
  await run(sql, basename(file));
}

console.log("\nAll migrations applied.");
