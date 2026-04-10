#!/usr/bin/env node
/**
 * Humane Design Engine — Preview & Screenshot
 *
 * Takes an HTML file, serves it locally, and captures screenshots
 * at multiple viewport sizes for design evaluation.
 *
 * Usage: node preview-and-screenshot.js <path-to-html-file> [output-dir]
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const filePath = process.argv[2];
const outputDir = process.argv[3] || path.join(process.env.HOME, '.humane-design-engine/screenshots');

if (!filePath) {
    console.error('Usage: node preview-and-screenshot.js <html-file> [output-dir]');
    process.exit(1);
}

if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
}

// Ensure output directory exists
fs.mkdirSync(outputDir, { recursive: true });

const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 812 }
];

async function captureScreenshots() {
    let puppeteer;
    try {
        puppeteer = require(path.join(process.env.HOME, '.humane-design-engine/node_modules/puppeteer'));
    } catch (e) {
        try {
            puppeteer = require('puppeteer');
        } catch (e2) {
            console.error('Puppeteer not found. Run setup-environment.sh first.');
            process.exit(1);
        }
    }

    // Read the HTML file
    const htmlContent = fs.readFileSync(filePath, 'utf8');

    // Create a simple HTTP server
    const server = http.createServer((req, res) => {
        // Serve the main HTML file for root requests
        if (req.url === '/' || req.url === '/index.html') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlContent);
        } else {
            // Try to serve other files relative to the HTML file's directory
            const requestedPath = path.join(path.dirname(filePath), req.url);
            if (fs.existsSync(requestedPath)) {
                const ext = path.extname(requestedPath);
                const mimeTypes = {
                    '.css': 'text/css',
                    '.js': 'application/javascript',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.svg': 'image/svg+xml',
                    '.woff2': 'font/woff2',
                    '.woff': 'font/woff'
                };
                res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
                res.end(fs.readFileSync(requestedPath));
            } else {
                res.writeHead(404);
                res.end('Not Found');
            }
        }
    });

    const port = 8787 + Math.floor(Math.random() * 1000);
    server.listen(port);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const screenshotPaths = [];

    for (const viewport of viewports) {
        const page = await browser.newPage();
        await page.setViewport({ width: viewport.width, height: viewport.height });

        await page.goto(`http://localhost:${port}/`, {
            waitUntil: 'networkidle2',
            timeout: 15000
        });

        // Wait a bit for fonts and animations to settle
        await new Promise(resolve => setTimeout(resolve, 1500));

        const screenshotPath = path.join(outputDir, `design-${viewport.name}.png`);
        await page.screenshot({
            path: screenshotPath,
            fullPage: true
        });

        screenshotPaths.push(screenshotPath);
        console.log(`✅ ${viewport.name} (${viewport.width}x${viewport.height}): ${screenshotPath}`);

        await page.close();
    }

    await browser.close();
    server.close();

    console.log('\n📸 Screenshots captured:');
    screenshotPaths.forEach(p => console.log(`   ${p}`));

    return screenshotPaths;
}

captureScreenshots().catch(err => {
    console.error('Screenshot error:', err.message);
    process.exit(1);
});
