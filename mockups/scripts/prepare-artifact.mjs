// Copies the Vite build into artifact/ in the shape the Claude Artifact host expects:
// the main page (index.html, the home page) without its document wrapper, since the host adds
// its own skeleton; other pages stay full documents; assets and images are published beside them.
import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const out = "artifact";
rmSync(out, { recursive: true, force: true });
cpSync("dist", out, { recursive: true });

const html = readFileSync(`${out}/index.html`, "utf8");
const head = html
  .match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(/\s*<meta charset[^>]*>/, "")
  .replace(/\s*<meta name="viewport"[^>]*>/, "");
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
writeFileSync(`${out}/index.html`, `${head.trim()}\n${body.trim()}\n`);
console.log("artifact/ ready");
