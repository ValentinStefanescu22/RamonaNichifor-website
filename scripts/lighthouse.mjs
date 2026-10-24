// Lighthouse, mobile preset, on a production server: node scripts/lighthouse.mjs [baseUrl]
// Build first with SITE_INDEXABLE=1 so the SEO audit sees an indexable page (previews are noindex on purpose).
// Runs each page 3 times, reports the median, writes HTML reports to reports/lighthouse/, exits 1 below budget.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3101";
const pages = ["/", "/en"];
const budget = { performance: 90, accessibility: 95, "best-practices": 95, seo: 100 };
const runs = Number(process.env.RUNS ?? 3);
mkdirSync("reports/lighthouse", { recursive: true });

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
let failed = false;
for (const path of pages) {
  const results = [];
  for (let i = 0; i < runs; i++) {
    const name = `reports/lighthouse/${path === "/" ? "home-ro" : "home-en"}-${i}`;
    execFileSync("npx", ["lighthouse", base + path, "--quiet", "--output=json", "--output=html", `--output-path=${name}`, "--chrome-flags=--headless=new"], {
      env: { ...process.env, CHROME_PATH: chromium.executablePath() },
      stdio: "inherit",
    });
    results.push(JSON.parse(readFileSync(`${name}.report.json`, "utf8")));
  }
  const score = (k) => median(results.map((r) => Math.round(r.categories[k].score * 100)));
  const metric = (id) => median(results.map((r) => r.audits[id].numericValue));
  const line = Object.keys(budget).map((k) => `${k} ${score(k)}`).join(" · ");
  console.log(`${path}: ${line} · LCP ${(metric("largest-contentful-paint") / 1000).toFixed(2)}s · CLS ${metric("cumulative-layout-shift").toFixed(3)} · TBT ${Math.round(metric("total-blocking-time"))}ms`);
  for (const [k, min] of Object.entries(budget)) if (score(k) < min) { failed = true; console.log(`  below budget: ${k} < ${min}`); }
}
process.exit(failed ? 1 : 0);
