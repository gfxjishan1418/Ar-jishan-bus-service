// Script to search Wikimedia Commons for exact bus photos and download them
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images/fleet');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(
    query
  )}&gsrlimit=8&prop=imageinfo&iiprop=url|size`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ARJishanLuxuryBus/1.0 (contact@arjishanbus.com)' } });
  const data = await res.json();
  const pages = data.query?.pages || {};
  const results = [];
  for (const k of Object.keys(pages)) {
    const info = pages[k].imageinfo?.[0];
    if (info && info.url && (info.url.endsWith('.jpg') || info.url.endsWith('.jpeg') || info.url.endsWith('.png'))) {
      results.push({
        title: pages[k].title,
        url: info.url,
        width: info.width,
        height: info.height,
      });
    }
  }
  return results;
}

async function main() {
  console.log('Searching for authentic luxury coach bus images...');

  const queries = {
    ac_coach: 'Hyundai Universe bus front',
    business_class: 'Scania Touring coach front',
    sleeper_coach: 'Volvo 9700 coach front',
    double_decker: 'Neoplan Skyliner coach',
    non_ac: 'Mercedes-Benz Tourismo front',
  };

  for (const [key, q] of Object.entries(queries)) {
    const items = await searchCommons(q);
    console.log(`\nResults for [${key}] (${q}):`);
    items.slice(0, 3).forEach((it, i) => {
      console.log(`  ${i + 1}. ${it.title} -> ${it.url}`);
    });
  }
}

main().catch(console.error);
