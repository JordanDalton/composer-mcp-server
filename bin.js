#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

// Get the directory where this file resides
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use dynamic import to load your module
import(join(__dirname, './build/index.js'))
  .then(module => {
    // Start your server
    module.startServer();
  })
  .catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });