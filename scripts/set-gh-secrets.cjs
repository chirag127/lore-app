const fs = require('node:fs');
const { execSync } = require('node:child_process');

const sa = fs.readFileSync('.secrets/sa-key.json', 'utf8').trim();

const secrets = {
  PUBLIC_FIREBASE_API_KEY: 'AIzaSyDid6eXT_vVhBMNCBXTXvV1oIl7U0FNnsM',
  PUBLIC_FIREBASE_AUTH_DOMAIN: 'bookatlas-13392.firebaseapp.com',
  PUBLIC_FIREBASE_PROJECT_ID: 'bookatlas-13392',
  PUBLIC_FIREBASE_STORAGE_BUCKET: 'bookatlas-13392.firebasestorage.app',
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '323894648273',
  PUBLIC_FIREBASE_APP_ID: '1:323894648273:web:6f6225e9ab8b1ff195d4f0',
  PUBLIC_FIREBASE_MEASUREMENT_ID: 'G-LJ4K9P1MHK',
  PUBLIC_RECAPTCHA_V3_SITE_KEY: '6Lf8JAstAAAAAKwTr7tf2x5eYezy5zvYDBfGU0v9',
};

for (const [name, value] of Object.entries(secrets)) {
  try {
    execSync(`gh secret set ${name} --body ${JSON.stringify(value)}`, {
      stdio: 'inherit',
    });
    console.log(`  set ${name}`);
  } catch (e) {
    console.error(`  FAIL ${name}: ${e.message}`);
    process.exit(1);
  }
}

try {
  const tmpFile = '.secrets/.sa.tmp';
  fs.writeFileSync(tmpFile, sa);
  execSync(`gh secret set FIREBASE_SERVICE_ACCOUNT < ${tmpFile}`, {
    stdio: 'inherit',
    shell: true,
  });
  fs.unlinkSync(tmpFile);
  console.log('  set FIREBASE_SERVICE_ACCOUNT');
} catch (e) {
  console.error(`  FAIL FIREBASE_SERVICE_ACCOUNT: ${e.message}`);
  process.exit(1);
}
