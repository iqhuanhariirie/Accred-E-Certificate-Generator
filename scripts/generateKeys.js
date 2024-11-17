const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateAndSaveKeys() {
  try {
    // Generate key pair
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'P-256',
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    // Create .env.local file content
    const envContent = [
      `CERTIFICATE_PRIVATE_KEY="${privateKey.replace(/\n/g, '\\n')}"`,
      `NEXT_PUBLIC_CERTIFICATE_PUBLIC_KEY="${publicKey.replace(/\n/g, '\\n')}"`,
      ''  // Add empty line at end of file
    ].join('\n');

    // Save to .env.local file
    fs.writeFileSync(path.join(__dirname, '../.env.local'), envContent);

    console.log('Keys generated and saved successfully to .env.local!');
    console.log('\nPublic Key:\n', publicKey);
    console.log('\nPrivate Key:\n', privateKey);

  } catch (error) {
    console.error('Error generating keys:', error);
    process.exit(1);
  }
}

// Run the function
generateAndSaveKeys();
