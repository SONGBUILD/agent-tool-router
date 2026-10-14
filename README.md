# agent-tool-router

Register a function under a name, call it with a timeout, and retry only when that call timed out.

```js
const { createRegistry } = require("./src/index");

const registry = createRegistry();
registry.register("search", search, { timeoutMs: 1500 });

await registry.callWithRetry("search", query, { retries: 1 });
```

An unknown name throws `UNKNOWN_TOOL`. A call that exceeds `timeoutMs` throws `TIMEOUT`. Other errors are not retried. This package does not talk to a model.

```bash
npm test
node src/cli.js
```

## License

MIT © Song Xiangrong
