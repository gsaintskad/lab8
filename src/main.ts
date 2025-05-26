import fs from 'fs';
import * as config from './config'; // Loads configuration from .env
import { createCustomCA } from './services/caService';
import { generateCertificateRequest, issueCertificate } from './services/entityService';
import { verifyInformation } from './services/verificationService';

async function main() {
    console.log("Starting OpenSSL certificate management process (using .env, English version)...");

    // Create output directory if it doesn't exist
    // config.OUTPUT_DIR is already an absolute path thanks to path.resolve in config.ts
    if (!fs.existsSync(config.OUTPUT_DIR)) {
        console.log(`\nCreating output directory: ${config.OUTPUT_DIR}`);
        fs.mkdirSync(config.OUTPUT_DIR, { recursive: true });
    }

    try {
        await createCustomCA();
        await generateCertificateRequest();
        await issueCertificate();
        await verifyInformation();
        console.log(`\nAll operations completed successfully!`);
        console.log(`All files have been saved in the directory: ${config.OUTPUT_DIR}`);
    } catch (error) {
        console.error("\nA critical error occurred during script execution. Process aborted.");
        // Error details should have been logged by runOpenSSLCommand or other parts of the script.
    }
}

// Run the main function
main();