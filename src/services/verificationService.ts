import fs from 'fs';
import path from 'path';
import * as config from '../config';
import { runOpenSSLCommand } from '../utils/opensslExecutor';

function checkFileExists(filePath: string, fileDisplayName: string): boolean {
    if (!fs.existsSync(filePath)) {
        console.warn(`Warning: File ${fileDisplayName} (${filePath}) not found. Cannot display information.`);
        return false;
    }
    console.log(`\nDisplaying information for file: ${filePath}`);
    return true;
}

export async function verifyInformation(): Promise<void> {
    console.log("\n--- Step 4: Verifying Information ---");

    console.log("\n--- Certificate Authority (CA) Information ---");
    if (checkFileExists(config.CA_CERT_FILE, `CA certificate (${path.basename(config.CA_CERT_FILE_NAME)})`)) {
        console.log("\n   c_issuer (Issuer of the CA certificate - should be self-issued):");
        runOpenSSLCommand(`x509 -in "${config.CA_CERT_FILE}" -noout -issuer`);
        console.log("\n   c_name (Subject name of the CA certificate):");
        runOpenSSLCommand(`x509 -in "${config.CA_CERT_FILE}" -noout -subject`);
        console.log("\n   c_info (Full details of the CA certificate):");
        runOpenSSLCommand(`x509 -in "${config.CA_CERT_FILE}" -noout -text`);
    }

    console.log("\n--- Requesting Entity Certificate Information ---");
    if (checkFileExists(config.ENTITY_CERT_FILE, `entity certificate (${path.basename(config.ENTITY_CERT_FILE_NAME)})`)) {
        console.log("\n   c_issuer (Issuer of the entity certificate - should be your CA):");
        runOpenSSLCommand(`x509 -in "${config.ENTITY_CERT_FILE}" -noout -issuer`);
        console.log("\n   c_name (Subject name of the entity certificate):");
        runOpenSSLCommand(`x509 -in "${config.ENTITY_CERT_FILE}" -noout -subject`);
        console.log("\n   c_info (Full details of the entity certificate):");
        runOpenSSLCommand(`x509 -in "${config.ENTITY_CERT_FILE}" -noout -text`);
    }
}