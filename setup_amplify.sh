#!/bin/bash

# Backup current amplify configuration
timestamp=$(date +%Y%m%d_%H%M%S)
mkdir -p ./amplify_backup_$timestamp
cp -r ./amplify/* ./amplify_backup_$timestamp/ 2>/dev/null || true

# Remove current amplify configuration
rm -rf ./amplify

# Initialize new amplify project
amplify init --app d1tya0t4p6ar75

# Pull the existing environment
amplify pull --appId d1tya0t4p6ar75 --envName staging

# Install necessary dependencies
npm install aws-amplify @aws-amplify/ui-react
