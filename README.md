# agent-tool-router

A tiny **agent core**: named tools, timeouts, a linear plan.

Not LangChain. You register functions, then run `[{ tool, input }, ...]`.

```bash
npm test
node src/cli.js
```

Use this as the inner loop of a larger assistant. Model I/O stays outside this package.

## License

MIT © Song Xiangrong
