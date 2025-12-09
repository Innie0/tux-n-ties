#!/bin/bash

# Simple script to commit and push changes to GitHub
# Usage: ./push.sh "Your commit message here"

if [ -z "$1" ]; then
    echo "Please provide a commit message"
    echo "Usage: ./push.sh 'Your commit message'"
    exit 1
fi

echo "Adding all changes..."
git add -A

echo "Committing changes..."
git commit -m "$1"

echo "Pushing to GitHub..."
git push origin main

echo "✅ Done! Vercel will automatically deploy your changes."

