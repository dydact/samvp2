#!/bin/bash
# setup_amplify_config.sh

echo "Setting up Amplify configuration..."

# Create amplify configuration file
mkdir -p .amplify
cat > .amplify/config.json << EOL
{
    "projectName": "SAMVP",
    "appId": "d1tya0t4p6ar75",
    "envName": "main",
    "defaultEditor": "code"
}
EOL

# Create amplify CLI configuration
cat > ~/.amplify/config.json << EOL
{
    "profiles": {
        "default": {
            "useProfile": true,
            "profileName": "default"
        }
    },
    "defaultProfile": "default"
}
EOL

# Update setup_dev_env.sh to include correct Amplify configuration
cat > setup_dev_env.sh << 'EOL'
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
EOL

chmod +x setup_dev_env.sh
