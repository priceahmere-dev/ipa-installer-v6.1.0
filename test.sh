#!/bin/bash

echo "🧪 Testing IPA Installer Server"
echo "================================"

# Check if server is running
echo "Checking server status..."
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running. Start it with: npm start"
    exit 1
fi

# Check status endpoint
echo "Checking status endpoint..."
STATUS=$(curl -s http://localhost:3000/status | jq -r '.status' 2>/dev/null || echo "jq not found")
if [ "$STATUS" = "IPA Installer Server Running" ]; then
    echo "✅ Status endpoint working"
else
    echo "⚠️  Status endpoint response: $STATUS"
fi

# Check if uploads directory exists
if [ -d "uploads" ]; then
    echo "✅ Uploads directory exists"
else
    echo "❌ Uploads directory missing"
fi

echo ""
echo "🎯 Test complete! Server should be working."
echo "🌐 Open http://localhost:3000 in your browser"