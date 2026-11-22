import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import packagejson from './package.json' with { type: 'json' };
const versionnumber = packagejson.version;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to read .env.json file
let googleAnalytics = '';
try {
  const envFile = readFileSync(resolve(__dirname, '.env.json'), 'utf8');
  const envData = JSON.parse(envFile);
  googleAnalytics = envData.googleanalytics || '';
} catch (error) {
  // File doesn't exist or is invalid, use empty string
  googleAnalytics = '';
}

export default defineConfig(({ command }) => ({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        main: 'src/index.html',
        about: 'src/about.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  plugins: [
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html
          .replace(/__VERSIONNUMBER__/g, versionnumber)
          .replace(/<!-- Google Analytics -->/g, (command === 'build') ? googleAnalytics : '<!-- Google Analytics -->');
      },
    }
  ],
}));
