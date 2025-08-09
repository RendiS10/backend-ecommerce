#!/bin/bash
echo "Testing backend server startup..."
cd "c:\Users\ReS\OneDrive\Desktop\project-bootcamp\backend"
echo "Current directory: $(pwd)"
echo "Checking if node_modules exists..."
if [ -d "node_modules" ]; then
    echo "✅ node_modules found"
else
    echo "❌ node_modules not found - running npm install..."
    npm install
fi

echo "Starting server..."
node app.js
