#!/usr/bin/env node

import { Colors } from "./cli/cliNative.js";
import { runCli } from "./cli/wizard.js";

runCli().catch((err) => {
  console.error(`\n${Colors.red}Error ejecutando CreateBackend:${Colors.reset}`, err);
  process.exit(1);
});
