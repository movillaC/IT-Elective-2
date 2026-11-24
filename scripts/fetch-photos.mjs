// Downloads every Unsplash photo listed in src/images.js into src/photos/ so the app embeds them
// (works offline afterwards). Run: npm run photos   (needs internet access to images.unsplash.com)
import { writeFile } from 'node:fs/promises'
import { IMAGES } from '../src/images.js'
let ok = 0
for (const [key, [id]] of Object.entries(IMAGES)) {
  const w = key === 'hero-coffee' ? 1000 : 640
  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70&fm=jpg`
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(res.status)
    await writeFile(new URL(`../src/photos/${key}.jpg`, import.meta.url), Buffer.from(await res.arrayBuffer()))
    ok++; console.log('✓', key)
  } catch (e) { console.log('✗', key, String(e)) }
}
console.log(`${ok}/${Object.keys(IMAGES).length} photos saved to src/photos/`)
process.exit(ok ? 0 : 1)
