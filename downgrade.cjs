const fs = require('fs');
const path = require('path');

// --- Backend ---
const backendPath = path.join(__dirname, 'backend', 'package.json');
const backendPkg = JSON.parse(fs.readFileSync(backendPath, 'utf8'));

// Remove dependencies
const backendDepsToRemove = [
  '@anthropic-ai/sdk',
  '@bull-board/api',
  '@bull-board/express',
  '@google/generative-ai',
  'bullmq',
  'groq-sdk',
  'ioredis',
  'socket.io',
  'puppeteer'
];
backendDepsToRemove.forEach(dep => {
  delete backendPkg.dependencies[dep];
});

// Downgrade express
if (backendPkg.dependencies.express) {
  backendPkg.dependencies.express = '^4.18.2';
}

fs.writeFileSync(backendPath, JSON.stringify(backendPkg, null, 2));

// --- Frontend ---
const frontendPath = path.join(__dirname, 'frontend', 'package.json');
const frontendPkg = JSON.parse(fs.readFileSync(frontendPath, 'utf8'));

// Remove dependencies
const frontendDepsToRemove = [
  '@tailwindcss/vite',
  'socket.io-client',
  'cobe', 
  'framer-motion',
  'motion',
  'chart.js',
  'recharts',
  'react-pageflip'
];
frontendDepsToRemove.forEach(dep => {
  delete frontendPkg.dependencies[dep];
});

// Downgrade react and react-dom
frontendPkg.dependencies.react = '^18.2.0';
frontendPkg.dependencies['react-dom'] = '^18.2.0';
frontendPkg.dependencies.tailwindcss = '^3.4.1';

// Add necessary v3 tailwind plugins if needed, but standard tailwind 3 setup needs postcss and autoprefixer.
frontendPkg.devDependencies.postcss = '^8.4.35';
frontendPkg.devDependencies.autoprefixer = '^10.4.17';

// Remove react 19 specific types
frontendPkg.devDependencies['@types/react'] = '^18.2.55';
frontendPkg.devDependencies['@types/react-dom'] = '^18.2.19';

fs.writeFileSync(frontendPath, JSON.stringify(frontendPkg, null, 2));

console.log('package.json files updated.');
