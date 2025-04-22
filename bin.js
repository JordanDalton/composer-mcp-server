#!/usr/bin/env node

// This is the entry point that will be executed when someone runs the command with npx
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

// Get the directory where this script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the built index.js file
const serverPath = join(__dirname, 'build', 'index.js');

console.log('Starting Composer MCP Server...');

// Spawn the server process
const server = spawn('node', [serverPath], {
  stdio: 'inherit' // This will pipe stdin/stdout/stderr to the parent process
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down Composer MCP Server...');
  server.kill('SIGINT');
  process.exit(0);
});

server.on('close', (code) => {
  if (code !== 0) {
    console.error(`Composer MCP Server exited with code ${code}`);
    process.exit(code);
  }
});