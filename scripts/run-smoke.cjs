const { spawnSync } = require('node:child_process');

const env = {
  ...process.env,
  BASE_URL: 'https://bookatlas-13392.web.app',
  OUT_DIR: 'C:\\Users\\chira\\AppData\\Local\\Temp\\bookatlas-prod-smoke',
};

const r = spawnSync('node', ['scripts/post-deploy-smoke.cjs'], {
  env,
  stdio: 'inherit',
  cwd: process.cwd(),
});
process.exit(r.status ?? 1);
