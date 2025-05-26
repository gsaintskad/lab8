import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

function getEnvVariable(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (value === undefined) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw new Error(`Critical error: Environment variable ${key} is missing. Please update your .env file.`);
    }
    return value;
}

export const OUTPUT_DIR = path.resolve(getEnvVariable('OUTPUT_DIR', './pki_environment'));

export const CA_KEY_FILE_NAME = getEnvVariable('CA_KEY_FILE_NAME', 'ca.key.pem');
export const CA_CERT_FILE_NAME = getEnvVariable('CA_CERT_FILE_NAME', 'ca.cert.pem');
export const CA_SERIAL_FILE_NAME = getEnvVariable('CA_SERIAL_FILE_NAME', 'ca.srl');

export const CA_KEY_FILE = path.join(OUTPUT_DIR, CA_KEY_FILE_NAME);
export const CA_CERT_FILE = path.join(OUTPUT_DIR, CA_CERT_FILE_NAME);
export const CA_SERIAL_FILE = path.join(OUTPUT_DIR, CA_SERIAL_FILE_NAME);

export const CA_SUBJECT = getEnvVariable('CA_SUBJECT', '/C=PL/ST=Kuyavian-Pomeranian/L=Torun/O=My Own CA Default/CN=My Own CA Root Default');
export const CA_KEY_PASSWORD = getEnvVariable('CA_KEY_PASSWORD'); // Should be set
export const CA_CERT_DAYS = getEnvVariable('CA_CERT_DAYS', '3650');


export const ENTITY_KEY_FILE_NAME = getEnvVariable('ENTITY_KEY_FILE_NAME', 'entity.key.pem');
export const ENTITY_CSR_FILE_NAME = getEnvVariable('ENTITY_CSR_FILE_NAME', 'entity.csr.pem');
export const ENTITY_CERT_FILE_NAME = getEnvVariable('ENTITY_CERT_FILE_NAME', 'entity.cert.pem');

export const ENTITY_KEY_FILE = path.join(OUTPUT_DIR, ENTITY_KEY_FILE_NAME);
export const ENTITY_CSR_FILE = path.join(OUTPUT_DIR, ENTITY_CSR_FILE_NAME);
export const ENTITY_CERT_FILE = path.join(OUTPUT_DIR, ENTITY_CERT_FILE_NAME);

export const ENTITY_SUBJECT = getEnvVariable('ENTITY_SUBJECT', '/C=PL/ST=Pomeranian/L=Gdansk/O=My Company Default/CN=server.example-default.com');
export const ENTITY_CERT_DAYS = getEnvVariable('ENTITY_CERT_DAYS', '365');

if (!CA_KEY_PASSWORD) {
    console.warn(
        "WARNING: The CA_KEY_PASSWORD environment variable is not set in your .env file. " +
        "The script may not function correctly. Consider setting this password or modifying the script " +
        "to allow OpenSSL to prompt for it interactively (this would require removing -pass and -passin options from commands)."
    );
    } else if (CA_KEY_PASSWORD === "superSecretPasswordFromEnv123!") { 
        console.warn(
        "\nWARNING: You are using the example CA key password from the .env file. " +
        "Remember to change it to a strong, unique password in your .env file!"
    );
}