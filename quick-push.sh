#!/bin/bash

# Quick push script - asks for commit message
echo "What changes did you make? (Enter a brief description):"
read -r message

if [ -z "$message" ]; then
    message="Update"
fi

echo ""
echo "🚀 Pushing changes to GitHub..."
echo ""

git add -A
git commit -m "$message"
git push origin main

echo ""
echo "✅ Done! Your changes are being deployed to Vercel."
echo "   Check your deployment at: https://vercel.com"

