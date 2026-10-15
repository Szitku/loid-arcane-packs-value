import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { caviaArcaneData } from "../src/data/arcanes/caviaArcaneData.js";
import { duviriArcaneData } from "../src/data/arcanes/duviriArcaneData.js";
import { eidolonArcaneData } from "../src/data/arcanes/eidolonArcaneData.js";
import { holdfastsArcaneData } from "../src/data/arcanes/holdfastsArcaneData.js";
import { necraliskArcaneData } from "../src/data/arcanes/necraliskArcaneData.js";
import { ostronArcaneData } from "../src/data/arcanes/ostronArcaneData.js";
import { solarisArcaneData } from "../src/data/arcanes/solarisArcaneData.js";
import { steelArcaneData } from "../src/data/arcanes/steelArcaneData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allArcanes = [
  ...caviaArcaneData,
  ...duviriArcaneData,
  ...eidolonArcaneData,
  ...holdfastsArcaneData,
  ...necraliskArcaneData,
  ...ostronArcaneData,
  ...solarisArcaneData,
  ...steelArcaneData,
];

// Deduplicate IDs
const uniqueIds = [...new Set(allArcanes.map((a) => a.id))];
console.log(`Found ${uniqueIds.length} unique arcanes to fetch.`);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, retries = 3, backoffMs = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "LoidExchange/1.0 (Warframe Community Tool)",
          Accept: "application/json",
        },
      });

      if (res.status === 429) {
        console.warn(`[Rate limit 429] Backing off for ${backoffMs * attempt}ms...`);
        await delay(backoffMs * attempt);
        continue;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`[Attempt ${attempt} failed] ${err.message}. Retrying in ${backoffMs * attempt}ms...`);
      await delay(backoffMs * attempt);
    }
  }
}

async function main() {
  const outputDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, "market-data.json");

  // Read existing data if available so failed individual fetches don't wipe existing stats
  let existingArcanes = {};
  let existingLastUpdated = null;
  try {
    const raw = await fs.readFile(outputFile, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed?.arcanes) existingArcanes = parsed.arcanes;
    if (parsed?.lastUpdated) existingLastUpdated = parsed.lastUpdated;
  } catch {
    // File doesn't exist yet, that's fine
  }

  const results = { ...existingArcanes };
  let successCount = 0;
  let failCount = 0;

  // Concurrency limit = 3 with 100ms pause
  const BATCH_SIZE = 3;
  for (let i = 0; i < uniqueIds.length; i += BATCH_SIZE) {
    const batch = uniqueIds.slice(i, i + BATCH_SIZE);
    
    await Promise.all(
      batch.map(async (id) => {
        const url = `https://api.warframe.market/v1/items/${id}/statistics`;
        try {
          const data = await fetchWithRetry(url);
          // Only preserve the 48hours closed statistics needed by the frontend calculations
          // This keeps the JSON file small (~300KB) and lightning fast to load
          const intervals = data?.payload?.statistics_closed?.["48hours"] || [];
          const minimalIntervals = intervals.map((item) => ({
            mod_rank: item.mod_rank,
            volume: item.volume,
            wa_price: item.wa_price,
          }));

          results[id] = {
            payload: {
              statistics_closed: {
                "48hours": minimalIntervals,
              },
            },
          };
          successCount++;
        } catch (err) {
          console.error(`Failed to fetch ${id}: ${err.message}`);
          failCount++;
        }
      })
    );

    const progress = Math.min(i + BATCH_SIZE, uniqueIds.length);
    process.stdout.write(`\rProgress: ${progress}/${uniqueIds.length} (${successCount} succeeded, ${failCount} failed)`);
    await delay(120);
  }

  console.log("\nFinished fetching market data.");

  const force = process.argv.includes("--force");
  const hasChanged = JSON.stringify(results) !== JSON.stringify(existingArcanes);

  if (!hasChanged && existingLastUpdated && !force) {
    console.log("Arcane market data is identical to existing cache. No changes written.");
    return;
  }

  const payload = {
    lastUpdated: new Date().toISOString(),
    itemCount: Object.keys(results).length,
    arcanes: results,
  };

  await fs.writeFile(outputFile, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`Saved market data to ${outputFile} (${(Buffer.byteLength(JSON.stringify(payload)) / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
