#!/bin/bash

# Build the project
npm run build

# Copy static files to docs directory
cp -r static/* docs/

# Add all files
git add .

# Commit changes
git commit -m "Update game"

# Push to GitHub
git push origin main 