'use strict';

function createRegistry() {
  const tools = new Map();
  function register(name, fn, { timeoutMs = 3000 } = {}) {
    tools.set(name, { fn, timeoutMs });
  }
  async function call(name, input) {
    const tool = tools.get(name);
    if (!tool) {
      const err = new Error(`unknown tool: ${name}`);
      err.code = 'UNKNOWN_TOOL';
      throw err;
    }
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        const err = new Error(`timeout: ${name}`);
        err.code = 'TIMEOUT';
        reject(err);
      }, tool.timeoutMs);
    });
    try {
      return await Promise.race([Promise.resolve(tool.fn(input)), timeout]);
    } finally {
      clearTimeout(timer);
    }
  }
  async function callWithRetry(name, input, { retries = 1 } = {}) {
    let last;
    for (let i = 0; i <= retries; i++) {
      try {
        return await call(name, input);
      } catch (err) {
        last = err;
        if (err.code !== 'TIMEOUT' || i === retries) throw err;
      }
    }
    throw last;
  }
  return { register, call, callWithRetry, names: () => [...tools.keys()] };
}

async function runPlan(registry, steps) {
  const out = [];
  for (const step of steps) {
    out.push({ tool: step.tool, result: await registry.call(step.tool, step.input) });
  }
  return out;
}

module.exports = { createRegistry, runPlan };
