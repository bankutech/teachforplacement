const fs = require('fs');
const data = JSON.parse(fs.readFileSync('eslint_report.json', 'utf8'));

const errors = {};
let totalErrors = 0;

data.forEach(file => {
  file.messages.forEach(msg => {
    if (msg.severity === 2) { // 2 means error
      totalErrors++;
      const rule = msg.ruleId || 'fatal-error';
      if (!errors[rule]) errors[rule] = 0;
      errors[rule]++;
    }
  });
});

console.log('Total errors:', totalErrors);
console.log('Errors breakdown:');
console.table(errors);
