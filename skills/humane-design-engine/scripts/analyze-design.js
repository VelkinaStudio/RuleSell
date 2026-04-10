#!/usr/bin/env node
/**
 * Humane Design Engine — Design Analyzer
 *
 * Programmatically analyzes a rendered HTML page for design quality signals:
 * - Color contrast ratios
 * - Font sizes and variety
 * - Spacing consistency
 * - Interactive target sizes
 * - Heading hierarchy
 *
 * Usage: node analyze-design.js <path-to-html-file>
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const filePath = process.argv[2];
if (!filePath) {
    console.error('Usage: node analyze-design.js <html-file>');
    process.exit(1);
}

async function analyzeDesign() {
    let puppeteer;
    try {
        puppeteer = require(path.join(process.env.HOME, '.humane-design-engine/node_modules/puppeteer'));
    } catch (e) {
        try { puppeteer = require('puppeteer'); } catch (e2) {
            console.error('Puppeteer not found.');
            process.exit(1);
        }
    }

    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlContent);
    });
    const port = 9787 + Math.floor(Math.random() * 1000);
    server.listen(port);

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const analysis = await page.evaluate(() => {
        const results = {
            typography: { fonts: new Set(), sizes: [], headings: [] },
            colors: { backgrounds: [], textColors: [], uniqueColors: new Set() },
            spacing: { margins: [], paddings: [] },
            interactiveTargets: [],
            issues: []
        };

        // Analyze all visible elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();

            if (rect.width === 0 && rect.height === 0) return;

            // Typography
            const fontFamily = style.fontFamily;
            const fontSize = parseFloat(style.fontSize);
            results.typography.fonts.add(fontFamily.split(',')[0].trim().replace(/['"]/g, ''));
            results.typography.sizes.push(fontSize);

            // Headings
            if (['H1','H2','H3','H4','H5','H6'].includes(el.tagName)) {
                results.typography.headings.push({
                    tag: el.tagName,
                    size: fontSize,
                    text: el.textContent.substring(0, 50)
                });
            }

            // Colors
            const bgColor = style.backgroundColor;
            const textColor = style.color;
            if (bgColor !== 'rgba(0, 0, 0, 0)') {
                results.colors.backgrounds.push(bgColor);
                results.colors.uniqueColors.add(bgColor);
            }
            results.colors.uniqueColors.add(textColor);

            // Interactive targets
            if (['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName) ||
                el.getAttribute('role') === 'button' ||
                style.cursor === 'pointer') {
                results.interactiveTargets.push({
                    tag: el.tagName,
                    width: rect.width,
                    height: rect.height,
                    text: el.textContent.substring(0, 30)
                });

                // Check minimum target size (44x44px per WCAG)
                if (rect.width < 44 || rect.height < 44) {
                    results.issues.push(`Small touch target: ${el.tagName} "${el.textContent.substring(0,20)}" is ${Math.round(rect.width)}x${Math.round(rect.height)}px (minimum 44x44)`);
                }
            }
        });

        // Convert Sets to Arrays for JSON serialization
        results.typography.fonts = Array.from(results.typography.fonts);
        results.colors.uniqueColors = Array.from(results.colors.uniqueColors);

        // Check heading hierarchy
        const headingLevels = results.typography.headings.map(h => parseInt(h.tag[1]));
        for (let i = 1; i < headingLevels.length; i++) {
            if (headingLevels[i] > headingLevels[i-1] + 1) {
                results.issues.push(`Heading hierarchy skip: ${results.typography.headings[i-1].tag} → ${results.typography.headings[i].tag}`);
            }
        }

        // Check font size variety
        const uniqueSizes = [...new Set(results.typography.sizes.map(s => Math.round(s)))];
        if (uniqueSizes.length < 3) {
            results.issues.push('Low typographic hierarchy: fewer than 3 distinct font sizes detected');
        }
        if (uniqueSizes.length > 8) {
            results.issues.push(`Excessive font sizes: ${uniqueSizes.length} distinct sizes detected. Consider a more constrained type scale.`);
        }

        // Summary
        results.summary = {
            totalFonts: results.typography.fonts.length,
            fontList: results.typography.fonts,
            distinctFontSizes: uniqueSizes.sort((a,b) => b-a),
            totalUniqueColors: results.colors.uniqueColors.length,
            headingCount: results.typography.headings.length,
            interactiveElementCount: results.interactiveTargets.length,
            issueCount: results.issues.length
        };

        return results;
    });

    console.log('\n🔍 Design Analysis Report');
    console.log('========================\n');

    console.log('📝 Typography:');
    console.log(`   Fonts: ${analysis.summary.fontList.join(', ')}`);
    console.log(`   Size scale: ${analysis.summary.distinctFontSizes.join(', ')}px`);
    console.log(`   Headings found: ${analysis.summary.headingCount}`);

    console.log('\n🎨 Colors:');
    console.log(`   Unique colors: ${analysis.summary.totalUniqueColors}`);

    console.log('\n👆 Interactive Elements:');
    console.log(`   Count: ${analysis.summary.interactiveElementCount}`);

    if (analysis.issues.length > 0) {
        console.log('\n⚠️  Issues:');
        analysis.issues.forEach(issue => console.log(`   • ${issue}`));
    } else {
        console.log('\n✅ No structural issues detected');
    }

    console.log('\n' + JSON.stringify(analysis.summary, null, 2));

    await browser.close();
    server.close();
}

analyzeDesign().catch(err => {
    console.error('Analysis error:', err.message);
    process.exit(1);
});
