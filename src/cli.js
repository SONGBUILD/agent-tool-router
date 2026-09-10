'use strict';

const { createRegistry, runPlan } = require('./index');

const reg = createRegistry();
reg.register('echo', (x) => x);
reg.register('upper', (s) => String(s).toUpperCase());

runPlan(reg, [
  { tool: 'echo', input: 'hi' },
  { tool: 'upper', input: 'ok' },
]).then((rows) => {
  console.log(JSON.stringify(rows, null, 2));
});
