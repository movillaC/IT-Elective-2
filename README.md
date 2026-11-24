# CUPChurts (React + Vite)
npm install && npm run dev
Photos: all images come from Unsplash and are mapped in src/images.js (change a photo id to swap an image).
If an image can't load, the checkerboard placeholder (src/assets/placeholder.png) shows instead.
Photo credits are listed from the landing page footer (data in src/images.js).

Embed photos offline: `npm run photos` downloads all Unsplash photos into src/photos/ (needs internet); they are then bundled with the app.
