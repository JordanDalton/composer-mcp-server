#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory where this file resides
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the server module and start it
import('./build/index.js')
  .then(module => {
    if (typeof module.startServer === 'function') {
      module.startServer()
        .catch(error => console.error('Server runtime error:', error));
    } else {
      console.error('Error: startServer function not found in module');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Failed to import server module:', error);
    process.exit(1);
  });