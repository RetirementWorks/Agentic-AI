// main.js
// Orchestrates the full pipeline:
//   1. capture_screenshots.js
//   2. analyze_competitors.js
//   3. build_report.js

const { spawn } = require('child_process');
const path = require('path');

if (!process.env.OPEN_AI_API) {
  console.error('Missing OPEN_AI_API environment variable.');
  process.exit(1);
}

function run(script) {
  return new Promise((resolve, reject) => {
    console.log(`\n=== Running ${script} ===`);
    const child = spawn(process.execPath, [path.join(__dirname, script)], {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`${script} exited with code ${code}`));
    });
    child.on('error', reject);
  });
}

(async () => {
  try {
    await run('capture_screenshots.js');
    await run('analyze_competitors.js');
    await run('build_report.js');
    console.log('\nPipeline complete.');
  } catch (err) {
    console.error('\nPipeline failed:', err.message);
    process.exit(1);
  }
})();
