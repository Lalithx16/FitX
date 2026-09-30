/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This app has zero server-side data dependency — every screen renders
  // from localStorage + static program data in the browser. Static export
  // turns the whole app into plain HTML/CSS/JS files: no serverless
  // function cold starts, trivially cacheable by a service worker for
  // offline use, and served straight from Vercel's CDN edge.
  output: "export",
  // Exercise thumbnails are small, pre-optimized local webp files served
  // straight from /public — no remote image optimization pipeline needed
  // (and the optimizer API isn't available in static export anyway).
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
