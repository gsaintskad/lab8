import fs from 'fs';
import path from 'path';
import * as config from '../config';
import { runOpenSSLCommand } from '../utils/opensslExecutor';

export async function createCustomCA(): Promise<void> {
    console.log("\n--- Step 1: Creating Custom Certificate Authority (CA) ---");

    if (fs.existsSync(config.CA_KEY_FILE) && fs.existsSync(config.CA_CERT_FILE)) {
        console.log(`CA files (${path.basename(config.CA_KEY_FILE_NAME)}, ${path.basename(config.CA_CERT_FILE_NAME)}) already exist in ${config.OUTPUT_DIR}. Skipping CA creation.`);
        return;
    }

    console.log(`\nGenerating CA private key (${config.CA_KEY_FILE_NAME})...`);
    runOpenSSLCommand(
        `genpkey -algorithm RSA -out "${config.CA_KEY_FILE}" -aes256 -pass pass:${config.CA_KEY_PASSWORD}`
    );

    console.log(`\nGenerating CA root certificate (${config.CA_CERT_FILE_NAME})...`);
    runOpenSSLCommand(
        `req -x509 -new -key "${config.CA_KEY_FILE}" -sha256 -days ${config.CA_CERT_DAYS} ` +
        `-out "${config.CA_CERT_FILE}" -subj "${config.CA_SUBJECT}" ` +
        `-passin pass:${config.CA_KEY_PASSWORD}`
    );

    console.log("CA created successfully.");
    console.log(`   CA Key: ${config.CA_KEY_FILE}`);
    console.log(`   CA Certificate: ${config.CA_CERT_FILE}`);
}