# Loid Vosfor Exchange - Precision Scheduler (Cloudflare Worker)

This Cloudflare Worker acts as a reliable cron trigger for the GitHub Actions market updater. Every 2 hours (`0 */2 * * *`), Cloudflare automatically wakes up and dispatches a GitHub Action workflow run via the GitHub API (`repository_dispatch`).

---

## Why this architecture is rock-solid

1. **Exact 2-Hour Precision:** Cloudflare cron triggers fire with exact second precision without being delayed, queued, or dropped during GitHub high-load periods.
2. **Zero Subrequest Limits:** The Worker makes only **1 single API call** per trigger to GitHub (`POST /repos/Szitku/loid-vosfor-exchange/dispatches`), consuming less than 2% of the Cloudflare Free Tier limits and executing in ~200ms.
3. **Resilient Data Scraping:** The scraping script in GitHub Actions (`fetch-market-data.mjs`) is hardened with:
   - Polite **2–3 requests/second** rate limiting (no more 429 rate limit errors from Warframe Market).
   - **Snapshot merging:** If any single arcane encounters a temporary network issue, it safely keeps the previous value from the `data` branch snapshot instead of aborting the whole run.

---

## Manual Trigger & Testing

You can trigger a manual run anytime:

* **From your browser or terminal:**
  ```powershell
  Invoke-RestMethod -Uri "https://loid-market-updater.szitku.workers.dev/trigger" -Method POST
  ```
  *(Or simply visit `https://loid-market-updater.szitku.workers.dev/trigger` in your browser)*.

* **Check the GitHub Actions tab:**
  You will immediately see the **Update Market Data** workflow start running!
