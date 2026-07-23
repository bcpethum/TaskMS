/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true, // Ensures routes generate /login/index.html for GitHub Pages
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/TaskMS' : '',
};

module.exports = nextConfig;
