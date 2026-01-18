#!/bin/bash

echo "🚀 UniSync Backend - Vercel Deployment Setup"
echo "=============================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed!"
else
    echo "✅ Vercel CLI already installed"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and fill in your values"
echo "   cp .env.example .env"
echo ""
echo "2. Login to Vercel"
echo "   vercel login"
echo ""
echo "3. Deploy to Vercel"
echo "   vercel"
echo ""
echo "4. Set environment variables in Vercel dashboard or CLI"
echo "   vercel env add SECRET_KEY"
echo "   vercel env add DB_CONN"
echo ""
echo "5. Deploy to production"
echo "   vercel --prod"
echo ""
echo "For detailed instructions, see VERCEL-DEPLOYMENT.md"
