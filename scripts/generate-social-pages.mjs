// Social crawlers (WhatsApp, Facebook, Twitter/X) don't execute JS, so a
// client-side title/meta change (e.g. react-helmet) never reaches them.
// This writes a real static index.html per route, straight into dist/,
// with route-specific <title>/og:*/twitter:* tags baked in at build time.
// It loads the exact same SPA bundle, so once a browser opens it,
// BrowserRouter takes over and renders the real page normally.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const indexHtmlPath = path.join(dist, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

const SITE_URL = 'https://naick1994.github.io/big-air-scoring-system';

const routes = [
  {
    path: 'woo-tarifa',
    title: 'Woo Tarifa Test Sessions',
    description: '2–4 September 2026 · Balneario Beach Club Tarifa.',
    image: `${SITE_URL}/woo-tarifa-og.jpg`,
  },
];

function replaceTag(html, pattern, replacement) {
  if (!pattern.test(html)) {
    throw new Error(`generate-social-pages: pattern not found in index.html: ${pattern}`);
  }
  return html.replace(pattern, replacement);
}

for (const route of routes) {
  let html = indexHtml;
  html = replaceTag(html, /<title>.*?<\/title>/, `<title>${route.title}</title>`);
  html = replaceTag(html, /<meta name="description" content=".*?" \/>/, `<meta name="description" content="${route.description}" />`);
  html = replaceTag(html, /<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${route.title}" />`);
  html = replaceTag(html, /<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${route.description}" />`);
  html = replaceTag(html, /<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${route.image}" />`);
  html = replaceTag(html, /<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${route.title}" />`);
  html = replaceTag(html, /<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${route.description}" />`);
  html = replaceTag(html, /<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${route.image}" />`);

  const outDir = path.join(dist, route.path);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  console.log(`generate-social-pages: wrote dist/${route.path}/index.html`);
}
