'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { createRegistry, runPlan } = require('../src/index');

describe('agent-tool-router', () => {
  it('runs a two-step plan', async () => {
    const r = createRegistry();
    r.register('echo', (x) => x);
    r.register('upper', (s) => String(s).toUpperCase());
    const rows = await runPlan(r, [
      { tool: 'echo', input: 'ab' },
      { tool: 'upper', input: 'cd' },
    ]);
    assert.deepEqual(rows.map((x) => x.result), ['ab', 'CD']);
  });

  it('times out', async () => {
    const r = createRegistry();
    r.register('slow', () => new Promise(() => {}), { timeoutMs: 20 });
    await assert.rejects(() => r.call('slow', {}), { code: 'TIMEOUT' });
  });
});
