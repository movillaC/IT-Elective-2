// All photos are from Unsplash (https://unsplash.com). Each entry: [photo path, photographer, username].
// To swap an image, change its photo id here. Photo credits are shown from the landing page footer.
const P = 'https://images.unsplash.com/'
export const IMAGES = {
  'hero-coffee': ['photo-1587755887860-edeaf70346ba', 'Joel Muniz', 'jmuniz'],
  'cup-contact': ['photo-1587755887860-edeaf70346ba', 'Joel Muniz', 'jmuniz'],
  cappuccino: ['photo-1676277571294-f0bcdb8dc7c8', 'insung yoon', 'insungpandora'],
  'iced-latte': ['photo-1721273109514-f9d9eee0a128', 'marke', 'sabinajeinku'],
  americano: ['photo-1669872484166-e11b9638b50e', 'Mehmet Talha Onuk', 'mtonuk'],
  'caramel-macchiato': ['photo-1662047102608-a6f2e492411f', 'Keith Brian de Leon', 'muskeither'],
  'cafe-mocha': ['photo-1600056781444-55f3b64235e3', 'Kitera Dent', 'kitera'],
  matcha: ['photo-1515823064-d6e0c04616a7', 'Jason Leung', 'ninjason'],
  'hot-chocolate': ['photo-1637572815755-c4b80092dce1', 'Elena Leya', 'foodistika'],
  croissant: ['photo-1623334044303-241021148842', 'Conor Brown', 'commonboxturtle'],
  'banana-bread': ['photo-1632931057819-4eefffa8e007', 'Cody Chan', 'cceee'],
  'product-1': ['photo-1447933601403-0c6688de566e', 'Mike Kenneally', 'asthetik'],
  'product-2': ['photo-1606791405792-1004f1718d0c', 'Christina Rumpf', 'rumpf'],
  'product-3': ['photo-1442512595331-e89e73853f31', 'Karl Fredrickson', 'kfred'],
  'product-4': ['photo-1790861286814-0fcb8ed0a4c9', 'Vitalii Abakumov', 'scoutori'],
  bags: ['photo-1759421556847-84f8d88222ba', 'feey', 'feeypflanzen'],
  'store-1': ['photo-1600093463592-8e36ae95ef56', 'Ruben Ramirez', 'pinchebesu'],
  'store-2': ['photo-1572231086568-6984943e6629', 'Austin Park', 'aussiep'],
  'store-3': ['photo-1551887196-72e32bfc7bf3', 'Louis Hansel', 'louishansel'],
  'store-4': ['photo-1566939937483-6eabe6f79e15', 'Daniela Araya', 'danielaraya'],
  avatar: ['photo-1579265898841-79c7890d69cf', 'Pete Willis', 'peetwillis'],
  'cup-small': ['photo-1675306408031-a9aad9f23308', 'Fatih Mehmet Yildiz', 'fatihmy18'],
}
// Photos saved by `npm run photos` (src/photos/<key>.jpg) are embedded and used first; otherwise hotlink from Unsplash.
const local = import.meta.glob('./photos/*.jpg', { eager: true, query: '?url', import: 'default' })
export const photoUrl = (key, w = 900) => {
  if (local[`./photos/${key}.jpg`]) return local[`./photos/${key}.jpg`]
  const e = IMAGES[key]
  return e ? `${P}${e[0]}?auto=format&fit=crop&w=${key === 'hero-coffee' ? 1400 : w}&q=75` : null
}
export const credits = [...new Map(Object.values(IMAGES).map((e) => [e[2], e])).values()]
