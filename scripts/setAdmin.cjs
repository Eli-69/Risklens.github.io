const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const email = process.argv[2];

if (!email) {
  console.error('Usage: node scripts/setAdmin.js user@example.com');
  process.exit(1);
}

async function run() {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    console.log(`✅ Admin claim set for ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to set admin claim:', error);
    process.exit(1);
  }
}

run();