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
import { hollvaniaArcaneData } from "../src/data/arcanes/hollvaniaArcaneData.js";

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
  ...hollvaniaArcaneData,
];

// Deduplicate IDs
const uniqueIds = [...new Set(allArcanes.map((a) => a.id))];
console.log(`Found ${uniqueIds.length} unique arcanes to fetch.`);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, retries = 4, baseBackoffMs = 2500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "LoidExchange/1.0 (Warframe Community Tool; Automated CI)",
          Accept: "application/json",
        },
      });

      if (res.status === 429) {
        const backoff = baseBackoffMs * attempt;
        console.warn(`\n[Rate limit 429] Backing off for ${backoff}ms (attempt ${attempt}/${retries})...`);
        await delay(backoff);
        continue;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      const backoff = 1200 * attempt;
      console.warn(`\n[Attempt ${attempt} failed] ${err.message}. Retrying in ${backoff}ms...`);
      await delay(backoff);
    }
  }
}

async function main() {
  const outputDir = path.join(__dirname, "..", "public", "data");
  await fs.mkdir(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, "market-data.json");

  const results = {};
  let successCount = 0;
  let failCount = 0;

  // Controlled concurrency = 2 with 350ms pause (~2.5 requests per second, well within API rate limits)
  const BATCH_SIZE = 2;
  for (let i = 0; i < uniqueIds.length; i += BATCH_SIZE) {
    const batch = uniqueIds.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (id) => {
        const url = `https://api.warframe.market/v1/items/${id}/statistics`;
        try {
          const data = await fetchWithRetry(url);
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
          console.error(`\nFailed to fetch fresh data for ${id}: ${err.message}`);
          failCount++;
        }
      })
    );

    const progress = Math.min(i + BATCH_SIZE, uniqueIds.length);
    process.stdout.write(
      `\rProgress: ${progress}/${uniqueIds.length} (${successCount} fresh, ${failCount} failed)`
    );
    await delay(350);
  }

  console.log("\nFinished fetching market data.");

  // Strict data integrity check: if any arcane fails, abort without committing partial/stale data
  if (failCount > 0) {
    throw new Error(
      `Market data update aborted: ${failCount} arcane(s) failed to fetch. Existing data snapshot preserved.`
    );
  }

  const payload = {
    lastUpdated: new Date().toISOString(),
    itemCount: Object.keys(results).length,
    arcanes: results,
  };

  await fs.writeFile(outputFile, JSON.stringify(payload, null, 2), "utf-8");
  console.log(
    `Saved complete fresh market data to ${outputFile} (${(Buffer.byteLength(JSON.stringify(payload)) / 1024).toFixed(1)} KB) - 100% (${successCount}/${uniqueIds.length}) updated.`
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
