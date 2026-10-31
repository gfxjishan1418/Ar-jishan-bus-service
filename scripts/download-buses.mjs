import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images/fleet');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Exact Wikimedia Commons / Wikimedia Special:FilePath URLs
const busFiles = [
  {
    name: 'ac-coach.jpg',
    // Luxury Hyundai Universe / Golden Dragon highway AC coach front 3/4 corner
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_Tourismo_Belarus.jpg?width=1200',
  },
  {
    name: 'business-class.jpg',
    // Scania Touring multi-axle luxury coach front 3/4 corner
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Scania_Touring.jpg?width=1200',
  },
  {
    name: 'sleeper-coach.jpg',
    // Volvo 9700 high-deck luxury front & left side 3/4 corner
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Volvo_9700_6x2_-_Front_and_left_side_IAA_2018.jpg?width=1200',
  },
  {
    name: 'double-decker.jpg',
    // Neoplan Skyliner twin-deck luxury coach 3/4 corner
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Neoplan_Skyliner_2011.jpg?width=1200',
  },
  {
    name: 'non-ac.jpg',
    // Tourliner / Tourismo intercity touring bus 3/4 corner
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Neoplan_Tourliner_der_aktuellen_Generation.jpg?width=1200',
  },
];

async function downloadAll() {
  for (const item of busFiles) {
    const dest = path.join(outDir, item.name);
    console.log(`Downloading ${item.name} from ${item.url}...`);
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      if (!res.ok) {
        console.error(`Failed ${item.name}: ${res.status} ${res.statusText}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log(`Saved ${item.name} (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`Error ${item.name}:`, err.message);
    }
  }
}

downloadAll();
