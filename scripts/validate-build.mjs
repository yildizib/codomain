import { readFile } from "node:fs/promises";

const pages = [
  { path: "_site/index.html", lang: "en" },
  { path: "_site/tr/index.html", lang: "tr" }
];

for (const page of pages) {
  const html = await readFile(page.path, "utf8");
  const checks = [
    [`lang=\"${page.lang}\"`, html.includes(`lang="${page.lang}"`)],
    ["GitHub repository link", html.includes("https://github.com/yildizib/codomain")],
    ["ehost sponsor link", html.includes("https://ehost.com.tr")],
    ["sponsored relationship", html.includes('rel="sponsored noreferrer"')]
  ];

  for (const [label, passed] of checks) {
    if (!passed) throw new Error(`${page.path}: missing ${label}`);
  }
}

console.log("Validated English and Turkish builds, repository link, and sponsor link.");
