#!/bin/bash
echo "Setting up development environment..."

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    npm install
else
    echo "Creating package.json..."
    npm init -y
    
    # Add required dependencies
    npm install --save \
        @aws-amplify/backend \
        @aws-amplify/backend-cli \
        aws-amplify \
        react \
        react-dom \
        react-router-dom
fi

echo "Configuring Amplify..."
amplify pull \
    --appId d1tya0t4p6ar75 \
    --envName main \
    --yes
