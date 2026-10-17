#!/usr/bin/env node
/**
 * Cross-platform deployment dispatcher.
 *
 * `npm run deploy:*` invokes this. It runs the bash implementation
 * (scripts/deploy.sh) on macOS/Linux and the PowerShell port
 * (scripts/deploy.ps1) on Windows, forwarding every argument, so the same
 * npm scripts work identically on all three operating systems.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

function run(cmd, cmdArgs) {
  return spawnSync(cmd, cmdArgs, { stdio: 'inherit' });
}

let result;
if (process.platform === 'win32') {
  const ps1 = join(here, 'deploy.ps1');
  const psArgs = ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', ps1, ...args];
  // Prefer PowerShell 7+ (pwsh); fall back to Windows PowerShell 5.1.
  result = run('pwsh', psArgs);
  if (result.error) {
    result = run('powershell', psArgs);
  }
} else {
  result = run('bash', [join(here, 'deploy.sh'), ...args]);
}

if (result.error) {
  console.error(`Failed to launch deployment script: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 0);
