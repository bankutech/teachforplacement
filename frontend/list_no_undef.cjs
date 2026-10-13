const fs = require('fs');
const data = JSON.parse(fs.readFileSync('eslint_report.json', 'utf8'));

data.forEach(file => {
  file.messages.forEach(msg => {
    if (msg.severity === 2 && msg.ruleId === 'no-undef') {
      console.log(`${file.filePath}:${msg.line}:${msg.column} - ${msg.message}`);
    }
  });
});
