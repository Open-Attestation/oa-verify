import fs from "fs";
import path from "path";

const GITHUB_CONTENTS_PATH = (ref = "beta") =>
  `https://api.github.com/repos/Open-Attestation/open-attestation/contents/test/fixtures/v4/__generated__?ref=${ref}`;

const OUTPUT_DIR = path.resolve("./test/fixtures/v4/__generated__");

// make sure the output directory exists
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

(async () => {
  // GitHub Repository Contents API: https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content
  const fixtures = (await (await fetch(GITHUB_CONTENTS_PATH())).json()) as { name: string; download_url: string }[];

  for (const f of fixtures) {
    const content = await (await fetch(f.download_url)).json();
    fs.writeFileSync(path.join(OUTPUT_DIR, f.name), JSON.stringify(content, null, 2));
  }
})();
