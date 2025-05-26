import fs from 'fs';
import path from 'path';
import * as config from '../config';
import { runOpenSSLCommand } from '../utils/opensslExecutor';

export async function generateCertificateRequest(): Promise<void> {
    console.log("\n--- Step 2: Generating Certificate Signing Request (CSR) ---");

    if (fs.existsSync(config.ENTITY_CSR_FILE)) {
        console.log(`CSR file (${path.basename(config.ENTITY_CSR_FILE_NAME)}) already exists in ${config.OUTPUT_DIR}. Skipping CSR generation.`);
        if (!fs.existsSync(config.ENTITY_KEY_FILE)) {
            console.warn(`Warning: Entity private key (${path.basename(config.ENTITY_KEY_FILE_NAME)}) does not exist, but CSR file does. This might lead to issues.`);
        }
        return;
    }

    if (!fs.existsSync(config.ENTITY_KEY_FILE)) {
        console.log(`\nGenerating private key for entity (${config.ENTITY_KEY_FILE_NAME})...`);
        runOpenSSLCommand(`genpkey -algorithm RSA -out "${config.ENTITY_KEY_FILE}"`);
    } else {
        console.log(`Entity private key (${path.basename(config.ENTITY_KEY_FILE_NAME)}) already exists.`);
    }

    console.log(`\nGenerating CSR file (${config.ENTITY_CSR_FILE_NAME})...`);
    runOpenSSLCommand(
        `req -new -key "${config.ENTITY_KEY_FILE}" -out "${config.ENTITY_CSR_FILE}" -subj "${config.ENTITY_SUBJECT}"`
    );

    console.log("CSR generated successfully.");
    console.log(`   Entity Key: ${config.ENTITY_KEY_FILE}`);
    console.log(`   Entity CSR: ${config.ENTITY_CSR_FILE}`);
}

export async function issueCertificate(): Promise<void> {
    console.log("\n--- Step 3: Issuing Certificate ---");

    if (fs.existsSync(config.ENTITY_CERT_FILE)) {
        console.log(`Entity certificate (${path.basename(config.ENTITY_CERT_FILE_NAME)}) already exists in ${config.OUTPUT_DIR}. Skipping issuance.`);
        return;
    }

    if (!fs.existsSync(config.CA_CERT_FILE) || !fs.existsSync(config.CA_KEY_FILE)) {
        console.error(`Error: CA files (${path.basename(config.CA_CERT_FILE_NAME)}, ${path.basename(config.CA_KEY_FILE_NAME)}) not found. Run Step 1 (CA creation) first.`);
        return; 
    }
    if (!fs.existsSync(config.ENTITY_CSR_FILE)) {
        console.error(`Error: CSR file (${path.basename(config.ENTITY_CSR_FILE_NAME)}) not found. Run Step 2 (CSR generation) first.`);
        return; 
    }

    console.log(`\nSigning CSR using CA to issue certificate (${config.ENTITY_CERT_FILE_NAME})...`);
     runOpenSSLCommand(
        `x509 -req -in "${config.ENTITY_CSR_FILE}" -CA "${config.CA_CERT_FILE}" -CAkey "${config.CA_KEY_FILE}" ` +
        `-CAserial "${config.CA_SERIAL_FILE}" -CAcreateserial -out "${config.ENTITY_CERT_FILE}" -days ${config.ENTITY_CERT_DAYS} -sha256 ` +
        `-passin pass:${config.CA_KEY_PASSWORD}`
    );

    console.log("Certificate issued successfully.");
    console.log(`   Entity Certificate: ${config.ENTITY_CERT_FILE}`);
    console.log(`   CA Serial File (created/used): ${config.CA_SERIAL_FILE}`);

    console.log("\nVerifying issued certificate against CA...");
    runOpenSSLCommand(`verify -CAfile "${config.CA_CERT_FILE}" "${config.ENTITY_CERT_FILE}"`);
}