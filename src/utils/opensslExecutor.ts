import { execSync, ExecSyncOptions } from 'child_process';

// Options for execSync, 'inherit' displays OpenSSL output in the console
const execOptions: ExecSyncOptions = { stdio: 'inherit' };

export function runOpenSSLCommand(command: string): void {
    console.log(`\nExecuting command: openssl ${command}`);
    try {
        execSync(`openssl ${command}`, execOptions);
        console.log("Command executed successfully.");
    } catch (error) {
        console.error(`Error executing command: openssl ${command}`);
        throw error; // Re-throw the error to be handled by the caller
    }
}