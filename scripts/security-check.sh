#!/bin/bash

# Security Hardening Script for Development Environment
# This script helps secure the development environment

echo "🔒 Security Hardening for World History Archive"
echo "================================================"

# 1. Check for open ports
echo ""
echo "📊 Checking open ports..."
netstat -tuln | grep LISTEN || echo "No listening ports found"

# 2. Run npm security audit
echo ""
echo "🔍 Running npm security audit..."
npm audit

# 3. Check for sensitive files
echo ""
echo "🔎 Checking for sensitive files..."
if [ -f .env ]; then
    echo "⚠️  WARNING: .env file found - ensure it's in .gitignore"
fi

if [ -f .env.local ]; then
    echo "✅ .env.local found (this is correct for local development)"
fi

# 4. Verify .gitignore
echo ""
echo "📝 Verifying .gitignore..."
if grep -q ".env" .gitignore; then
    echo "✅ .env files are ignored in git"
else
    echo "⚠️  WARNING: .env files should be added to .gitignore"
fi

# 5. Check for exposed secrets
echo ""
echo "🔑 Checking for potential secrets in code..."
if grep -r "password\|secret\|api_key\|token" --include="*.ts" --include="*.tsx" --include="*.js" src/ 2>/dev/null | grep -v "// " | grep -v "node_modules"; then
    echo "⚠️  WARNING: Potential secrets found in code"
else
    echo "✅ No obvious secrets found in code"
fi

# 6. Verify security headers
echo ""
echo "🛡️  Checking security configuration..."
if [ -f next.config.ts ]; then
    if grep -q "securityHeaders" next.config.ts; then
        echo "✅ Security headers configured in next.config.ts"
    else
        echo "⚠️  WARNING: Security headers not found in next.config.ts"
    fi
fi

# 7. Check Node.js version
echo ""
echo "📦 Checking Node.js version..."
node --version
echo "✅ Using Node.js $(node --version)"

echo ""
echo "================================================"
echo "✅ Security check complete!"
echo ""
echo "Recommendations:"
echo "1. Run 'npm audit fix' to fix vulnerabilities"
echo "2. Keep dependencies updated with 'npm update'"
echo "3. Use 'npm run dev:secure' for secure development"
echo "4. Never commit .env files to git"
echo "5. Enable HTTPS in production"
echo "================================================"
