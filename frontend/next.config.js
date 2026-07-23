/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enables static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;


