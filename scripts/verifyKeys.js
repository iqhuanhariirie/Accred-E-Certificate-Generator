const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({
  path: path.join(__dirname, '../.env.local')
});

function verifyKeys() {
  try {
    // Check if keys exist in environment
    if (!process.env.CERTIFICATE_PRIVATE_KEY) {
      throw new Error('Private key not found in environment variables');
    }
    if (!process.env.NEXT_PUBLIC_CERTIFICATE_PUBLIC_KEY) {
      throw new Error('Public key not found in environment variables');
    }

    console.log('Environment variables loaded successfully');
    console.log('\nPrivate Key found:', process.env.CERTIFICATE_PRIVATE_KEY.substring(0, 50) + '...');
    console.log('Public Key found:', process.env.NEXT_PUBLIC_CERTIFICATE_PUBLIC_KEY.substring(0, 50) + '...');

    // Check key format
    const privateKeyFormat = checkKeyFormat(process.env.CERTIFICATE_PRIVATE_KEY, 'PRIVATE');
    const publicKeyFormat = checkKeyFormat(process.env.NEXT_PUBLIC_CERTIFICATE_PUBLIC_KEY, 'PUBLIC');

    if (privateKeyFormat && publicKeyFormat) {
      console.log('\nKey format validation passed! ');
    }

  } catch (error) {
    console.error('\nError verifying keys:', error);
    process.exit(1);
  }
}

function checkKeyFormat(key, type) {
  const startMarker = type === 'PRIVATE' 
    ? '-----BEGIN PRIVATE KEY-----'
    : '-----BEGIN PUBLIC KEY-----';
  
  const endMarker = type === 'PRIVATE'
    ? '-----END PRIVATE KEY-----'
    : '-----END PUBLIC KEY-----';

  if (!key.includes(startMarker) || !key.includes(endMarker)) {
    console.error(`\n ${type} key is missing proper PEM markers`);
    console.log('Expected format:');
    console.log(startMarker);
    console.log('<base64-encoded-key-data>');
    console.log(endMarker);
    return false;
  }

  // Remove markers and whitespace
  const keyContent = key
    .replace(startMarker, '')
    .replace(endMarker, '')
    .replace(/[\r\n\s]/g, '');

  // Check if remaining content is base64
  try {
    Buffer.from(keyContent, 'base64');
    console.log(`\n ${type} key is in valid base64 format`);
    return true;
  } catch (error) {
    console.error(`\n ${type} key is not in valid base64 format`);
    return false;
  }
}

// Run the verification
verifyKeys();
