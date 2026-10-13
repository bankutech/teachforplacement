const fs = require('fs');
const path = require('path');

// --- Backend ---
const backendPath = path.join(__dirname, 'backend', 'package.json');
const backendPkg = JSON.parse(fs.readFileSync(backendPath, 'utf8'));

// Re-add dependencies (we'll just let npm-check-updates fetch the latest versions, so any version works here for now)
const backendDepsToAdd = {
  '@anthropic-ai/sdk': '^0.112.4',
  '@bull-board/api': '^8.1.2',
  '@bull-board/express': '^8.1.2',
  '@google/generative-ai': '^0.24.1',
  'bullmq': '^5.80.10',
  'groq-sdk': '^1.3.0',
  'ioredis': '^5.11.1',
  'socket.io': '^4.8.3',
  'puppeteer': '^25.3.0'
};
Object.assign(backendPkg.dependencies, backendDepsToAdd);

// Upgrade express
backendPkg.dependencies.express = '^5.2.1';

fs.writeFileSync(backendPath, JSON.stringify(backendPkg, null, 2));

// --- Frontend ---
const frontendPath = path.join(__dirname, 'frontend', 'package.json');
const frontendPkg = JSON.parse(fs.readFileSync(frontendPath, 'utf8'));

// Re-add dependencies
const frontendDepsToAdd = {
  '@tailwindcss/vite': '^4.1.18',
  'socket.io-client': '^4.2.0',
  'cobe': '^0.6.5',
  'framer-motion': '^12.40.0',
  'motion': '^12.23.26',
  'chart.js': '^4.5.1',
  'recharts': '^2.8.0',
  'react-pageflip': '^2.0.3',
  'tailwindcss': '^4.1.18'
};
Object.assign(frontendPkg.dependencies, frontendDepsToAdd);

// Upgrade react and react-dom
frontendPkg.dependencies.react = '^19.2.6';
frontendPkg.dependencies['react-dom'] = '^19.2.6';

// Re-add react 19 specific types
frontendPkg.devDependencies['@types/react'] = '^19.2.5';
frontendPkg.devDependencies['@types/react-dom'] = '^19.2.3';

// Remove tailwind 3 dependencies
delete frontendPkg.devDependencies.postcss;
delete frontendPkg.devDependencies.autoprefixer;

fs.writeFileSync(frontendPath, JSON.stringify(frontendPkg, null, 2));

console.log('package.json files re-upgraded.');
