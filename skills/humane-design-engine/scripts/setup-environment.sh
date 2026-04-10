#!/bin/bash
# Humane Design Engine — Environment Setup
# Checks and installs all required dependencies

echo "🎨 Humane Design Engine — Setting up environment..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js $(node -v) found"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js with npm."
    exit 1
else
    echo "✅ npm $(npm -v) found"
fi

# Create working directory for design previews
WORK_DIR="$HOME/.humane-design-engine"
mkdir -p "$WORK_DIR/previews"
mkdir -p "$WORK_DIR/screenshots"

# Install Puppeteer (for screenshots)
if [ ! -d "$WORK_DIR/node_modules/puppeteer" ]; then
    echo "📦 Installing Puppeteer..."
    cd "$WORK_DIR"
    npm init -y 2>/dev/null
    npm install puppeteer 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Puppeteer installed"
    else
        echo "⚠️  Puppeteer installation failed. Trying puppeteer-core..."
        npm install puppeteer-core 2>/dev/null
        if [ $? -eq 0 ]; then
            echo "✅ Puppeteer-core installed (will need Chrome/Chromium path)"
        else
            echo "⚠️  Screenshot capability unavailable. Design will work without visual evaluation."
        fi
    fi
else
    echo "✅ Puppeteer already installed"
fi

# Install http-server for local previews
if ! command -v npx &> /dev/null; then
    echo "⚠️  npx not available"
else
    echo "✅ npx available for http-server"
fi

# Check for Chrome/Chromium
if command -v google-chrome &> /dev/null || command -v chromium-browser &> /dev/null || command -v chromium &> /dev/null; then
    echo "✅ Chrome/Chromium found"
else
    echo "📦 Installing Chromium..."
    sudo apt-get update && sudo apt-get install -y chromium-browser 2>/dev/null || \
    sudo apt-get install -y chromium 2>/dev/null || \
    echo "⚠️  Could not install Chromium. Screenshots may not work."
fi

echo ""
echo "🎨 Environment ready. Humane Design Engine can now:"
if [ -d "$WORK_DIR/node_modules/puppeteer" ] || [ -d "$WORK_DIR/node_modules/puppeteer-core" ]; then
    echo "   ✅ Create designs"
    echo "   ✅ Preview in headless browser"
    echo "   ✅ Take screenshots for visual evaluation"
    echo "   ✅ Run design critiques"
else
    echo "   ✅ Create designs"
    echo "   ⚠️  Cannot take screenshots (Puppeteer not available)"
    echo "   ⚠️  Visual critique will be code-based only"
fi
