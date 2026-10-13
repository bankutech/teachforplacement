const fs = require('fs');
const path = require('path');

const exclude = ['node_modules', 'dist', '.git', '.gemini', 'API_DOCS'];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (exclude.includes(file)) continue;
    
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walk(filePath);
    } else if (stat.isFile() && (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.css'))) {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes('TODO')) {
        const lines = content.split('\n');
        lines.forEach((line, i) => {
          if (line.includes('TODO')) {
            console.log(`${filePath}:${i + 1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

walk('.');
