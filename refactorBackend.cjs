const fs = require('fs');
const path = require('path');

const backendSrcDir = path.join(__dirname, 'backend', 'src');
const indexJsPath = path.join(backendSrcDir, 'index.js');
const routesIndexJsPath = path.join(backendSrcDir, 'routes', 'index.js');
const startupJsPath = path.join(backendSrcDir, 'startup.js');

let indexJsContent = fs.readFileSync(indexJsPath, 'utf8');

// Extract routes
const routeRegex = /import\s+([a-zA-Z0-9_]+)\s+from\s+['"](\.\/routes\/.*?)['"];/g;
let routesImports = '';
let routeUses = '';

let match;
const importedRoutes = new Set();
while ((match = routeRegex.exec(indexJsContent)) !== null) {
  const routeName = match[1];
  let routePath = match[2];
  
  // adjust path relative to routes/index.js
  if (routePath.startsWith('./routes/')) {
    routePath = './' + routePath.substring(9);
  }
  
  routesImports += `import ${routeName} from '${routePath}';\n`;
  importedRoutes.add(routeName);
}

// Special case for recruiterRoutes which might be `../src/routes/...`
const recruiterRegex = /import\s+recruiterRoutes\s+from\s+['"]\.\.\/src\/routes\/recruiter\.routes\.js['"];/;
if (indexJsContent.match(recruiterRegex)) {
  routesImports += `import recruiterRoutes from './recruiter.routes.js';\n`;
  importedRoutes.add('recruiterRoutes');
}

routesImports += `import paymentsRoutes from './payments.js';\n`;

// Now find all app.use('/api/...', routeName)
const useRegex = /app\.use\(['"](\/api\/.*?)['"],\s*([a-zA-Z0-9_]+)\);/g;
while ((match = useRegex.exec(indexJsContent)) !== null) {
  const apiPath = match[1].replace('/api/', '/');
  const routeName = match[2];
  routeUses += `router.use('${apiPath}', ${routeName});\n`;
}

// Add payment routes
routeUses += `router.use('/payments', paymentsRoutes);\n`;

const routesIndexContent = `import express from 'express';\n\n${routesImports}\nconst router = express.Router();\n\n${routeUses}\nexport default router;\n`;
fs.writeFileSync(routesIndexJsPath, routesIndexContent, 'utf8');

// Now startup.js
const startupJsContent = `
import { initializeDefaultChannels } from './controllers/communityFirebaseController.js';
import { initializePostScheduler } from './services/postScheduler.js';
import { initJobFetcher } from './services/jobFetcher.js';
import JobAlert from './models/JobAlert.model.js';
import {
  scheduleWeeklyDigest,
  initializeDigestQueue,
  startDigestWorker
} from './services/weeklyDigestService.js';
import { startOutreachWorker } from './services/outreachQueue.js';
import { initializeSocket } from './config/socket.js';

export async function initializeServices(httpServer) {
  try {
    await initializeDefaultChannels();
    console.log('💬 Community channels initialized');
  } catch (channelError) {
    console.warn('⚠️ Could not initialize default channels:', channelError.message);
  }

  try {
    await initializePostScheduler();
  } catch (schedulerError) {
    console.warn('⚠️ Post scheduler initialization skipped:', schedulerError.message);
  }

  const allowDevDbMutations = process.env.ALLOW_DEV_DB_MUTATIONS === 'true';
  if (process.env.NODE_ENV === 'development' && allowDevDbMutations) {
    try {
      const testEmail = process.env.DEV_USER_EMAIL || process.env.EMAIL_USER;
      if (testEmail) {
        const result = await JobAlert.updateMany(
          { userEmail: 'dev@example.com' },
          { $set: { userEmail: testEmail } }
        );
        if (result.modifiedCount > 0) {
          console.log(\`📧 Updated \${result.modifiedCount} alerts to use email: \${testEmail}\`);
        }
      }
    } catch (err) {
      console.warn('⚠️ Could not update dev alert emails:', err.message);
    }
  } else if (process.env.NODE_ENV === 'development' && !allowDevDbMutations) {
    console.info('ℹ️ Skipping dev alert email update (ALLOW_DEV_DB_MUTATIONS is not true)');
  }

  initializeSocket(httpServer);

  try {
    await initJobFetcher();
  } catch (fetcherError) {
    console.warn('⚠️ Job fetcher initialization skipped:', fetcherError.message);
  }

  try {
    const digestQueueReady = await initializeDigestQueue();
    if (digestQueueReady) {
      startDigestWorker();
    }
    scheduleWeeklyDigest();
  } catch (digestError) {
    console.warn(
      '⚠️ Weekly digest scheduler initialization skipped:',
      digestError.message
    );
  }

  try {
    startOutreachWorker();
  } catch (outreachErr) {
    console.warn('⚠️ Outreach worker initialization skipped:', outreachErr.message);
  }
}
`;
fs.writeFileSync(startupJsPath, startupJsContent, 'utf8');

// Refactor index.js
let newIndex = fs.readFileSync(indexJsPath, 'utf8');

// Remove all individual route imports
newIndex = newIndex.replace(/import\s+[a-zA-Z0-9_]+\s+from\s+['"]\.\/routes\/.*?['"];\n/g, '');
newIndex = newIndex.replace(/import\s+recruiterRoutes\s+from\s+['"]\.\.\/src\/routes\/recruiter\.routes\.js['"];\n/g, '');
newIndex = newIndex.replace(/import\s+outreachRoutes\s+from\s+['"]\.\/routes\/outreach\.route\.js['"];\n/g, '');
newIndex = newIndex.replace(/import\s+inputRoutes\s+from\s*['"]\.\/routes\/input\.route\.js['"];\n/g, '');

// Import the new router and startup
newIndex = newIndex.replace(/(import express from 'express';)/, "$1\nimport apiRoutes from './routes/index.js';\nimport { initializeServices } from './startup.js';");

// Remove the individual app.uses
newIndex = newIndex.replace(/app\.use\(['"]\/api\/.*?['"],\s*[a-zA-Z0-9_]+\);\n/g, '');

// Remove payment dynamic import
newIndex = newIndex.replace(/import\(['"]\.\/routes\/payments\.js['"]\)\.then\(\(module\)\s*=>\s*\{\s*app\.use\(['"]\/api\/payments['"],\s*module\.default\);\s*console\.log\(['"]✅ Payment routes loaded['"]\);\s*\}\)\.catch\(\(error\)\s*=>\s*\{\s*console\.warn\(['"]⚠️ Payment routes disabled:['"],\s*error\.message\);\s*\}\);\n/g, '');

// Add the central router use
newIndex = newIndex.replace(/(app\.use\('\/api\/docs', swaggerUi\.serve, swaggerUi\.setup\(swaggerSpec\)\);)/, "$1\napp.use('/api', apiRoutes);");

// Clean up startServer
// Remove everything inside startServer after httpServer.listen except calling initializeServices
const startServerRegex = /(httpServer\.listen\(PORT, \(\) => \{[\s\S]*?\}\);)[\s\S]*?(} catch \(error\))/;
newIndex = newIndex.replace(startServerRegex, "$1\n\n    await initializeServices(httpServer);\n\n  $2");

// Remove old imports from index.js that were moved to startup.js
const importsToRemove = [
  "import { initializeSocket } from './config/socket.js';",
  "import { initializeDefaultChannels } from './controllers/communityFirebaseController.js';",
  "import { initializePostScheduler } from './services/postScheduler.js';",
  "import { initJobFetcher } from './services/jobFetcher.js';",
  "import JobAlert from './models/JobAlert.model.js';",
  "import {\n  scheduleWeeklyDigest,\n  initializeDigestQueue,\n  startDigestWorker\n} from './services/weeklyDigestService.js';",
  "import { startOutreachWorker } from './services/outreachQueue.js';"
];
importsToRemove.forEach(imp => {
  newIndex = newIndex.replace(imp, '');
});

// Remove unsafe CSP
newIndex = newIndex.replace(/"data:",\s*"blob:",\s*/, '');

fs.writeFileSync(indexJsPath, newIndex, 'utf8');
console.log('Backend refactored successfully.');
