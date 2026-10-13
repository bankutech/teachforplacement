const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'frontend', 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Remove all static template imports
content = content.replace(/import\s+[\w_]+\s+from\s+['"]\.\/components\/portfolio\/templates\/.*?['"];?\n/g, '');

// Also remove specific ones that might have slightly different paths
content = content.replace(/import\s+Hero\s+from\s+['"]\.\/components\/portfolio\/templates\/Magazine_Editorial\/Hero['"];?\n/g, '');

// 2. Import TemplateRegistry
if (!content.includes('TemplateRegistry')) {
  content = content.replace(/(import\s+\{\s*NotFound\s*\}\s+from\s+['"]\.\/pages['"];?)/, "$1\nimport TemplateRegistry from './components/portfolio/TemplateRegistry';\n");
}

// 3. Remove all `<Suspense fallback={<LoadingScreen ... />}>` inside `<Route element={...}>`
// E.g., <Route path="..." element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="..." />}><Component /></Suspense></ProtectedRoute>} />
// We'll replace it with just <ProtectedRoute><Component /></ProtectedRoute>
// We need a careful regex.
// A typical pattern: <Suspense fallback={<LoadingScreen[^>]*>}>(.*?)</Suspense>
content = content.replace(/<Suspense\s+fallback=\{<LoadingScreen[^>]*>\}>\s*(<[A-Za-z0-9_]+[^>]*\/>)\s*<\/Suspense>/g, '$1');
content = content.replace(/<Suspense\s+fallback=\{<LoadingScreen[^>]*>\}>\s*(<[A-Za-z0-9_]+\s*>[^<]*<\/[A-Za-z0-9_]+>)\s*<\/Suspense>/g, '$1');
// Also handle `null` fallback: <Suspense fallback={null}>
content = content.replace(/<Suspense\s+fallback=\{null\}>\s*(<[A-Za-z0-9_]+[^>]*\/>)\s*<\/Suspense>/g, '$1');
// Also handle standard divs: <Suspense fallback={<div[^>]*>.*?<\/div>}>
content = content.replace(/<Suspense\s+fallback=\{<div[^>]*>.*?<\/div>\}>\s*(<[A-Za-z0-9_]+[^>]*\/>)\s*<\/Suspense>/g, '$1');

// 4. Wrap <Routes> children in ONE top-level Suspense inside the <Routes> wrapper, or wrap the whole Routes block.
// Wait, react-router requires <Route> as direct children of <Routes>. 
// So the <Suspense> must wrap the <Routes> component, not be inside it!
// E.g. <Suspense fallback={<LoadingScreen label="Loading application..." />}><Routes>...</Routes></Suspense>
if (!content.includes('<Suspense fallback={<LoadingScreen label="Loading route..." />}><Routes>')) {
  content = content.replace(/<Routes>/, '<Suspense fallback={<LoadingScreen label="Loading route..." />}><Routes>');
  content = content.replace(/<\/Routes>/, '</Routes></Suspense>');
}

// 5. Remove legacy redirect routes
const legacyRoutesToRemove = [
  '<Route path="/resume-builder-landing" element={<Navigate to="/resume-builder" replace />} />',
  '<Route path="/roast" element={<Navigate to="/resume-roast" replace />} />',
  '<Route path="/visualizer" element={<Navigate to="/project-visualizer" replace />} />',
  '<Route path="/ai-interview" element={<Navigate to="/mock-interview" replace />} />',
  '<Route path="/jobs" element={<Navigate to="/job-finder/search" replace />} />',
  '<Route path="/interview-prep" element={<Navigate to="/mock-interview/practice" replace />} />',
  '<Route path="/portfolio/github" element={<Navigate to="/github-portfolio/build" replace />} />',
  '<Route path="/project-visualizer-legacy" element={<Navigate to="/project-visualizer" replace />} />',
  '<Route\\s+path="/project-visualizer-legacy"\\s*element=\\{\\s*<Navigate to="/project-visualizer" replace />\\s*\\}\\s*/>'
];

legacyRoutesToRemove.forEach(rt => {
  // Try exact match or regex
  content = content.split(rt).join('');
  // for multiline
  const re = new RegExp(rt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\s\+/g, '\\s+'), 'g');
  content = content.replace(re, '');
});

// Also remove multiline project-visualizer-legacy
content = content.replace(/<Route\s*path="\/project-visualizer-legacy"\s*element=\{\s*<Navigate to="\/project-visualizer" replace \/>\s*\}\s*\/>/g, '');

// 6. Delete hardcoded template routes
content = content.replace(/<Route path="\/templates\/[^"]+"\s+element=\{<[^>]+>\}\s*\/>\n?/g, '');
// Also `<Route path="/preview-inspired-dev-jadiya" element={<InspiredDevJadiya />} />`
content = content.replace(/<Route path="\/preview-inspired-dev-jadiya" element=\{<InspiredDevJadiya \/>\} \/>\n?/g, '');

// 7. Insert the dynamic template route
if (!content.includes('path="/templates/:templateId"')) {
  content = content.replace(/(<Route path="\/templates" element=\{<TemplateGallery \/>\} \/>)/, "$1\n        <Route path=\"/templates/:templateId\" element={<TemplateRegistry />} />");
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('App.jsx refactored successfully.');
