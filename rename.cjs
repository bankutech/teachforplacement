const fs = require('fs');
const path = require('path');

const root = 'C:/Users/Administrator/teacHforPlaCeMent/teachforplacement-main';

const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.netlify', '.storybook', 'public'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!excludeDirs.includes(path.basename(file))) {
        results = results.concat(walk(file));
      }
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk(root);
const exts = ['.js', '.jsx', '.json', '.html', '.md', '.css', '.env.example', '.txt', '.cjs', '.mjs', 'Dockerfile', 'netlify.toml', 'vercel.json'];

files.forEach(file => {
  if (exts.some(ext => file.endsWith(ext)) || exts.includes(path.basename(file))) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
      .replace(/TeacHforPLaCeMeNt/g, 'TeacHforPLaCeMeNt')
      .replace(/TeacHforPLaCeMeNt/g, 'TeacHforPLaCeMeNt')
      .replace(/teachforplacement/g, 'teachforplacement')
      .replace(/teachforplacement/g, 'teachforplacement');
    
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Updated', file);
    }
  }
});
