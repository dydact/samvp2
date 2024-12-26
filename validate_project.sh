#!/bin/bash
echo "Validating project structure and dependencies..."
LOG_FILE="project_validation.log"

# Check required files and directories
REQUIRED=(
    "master_src/context/AuthContext.tsx"
    "master_src/amplify/data/resource.ts"
    "master_src/components/ProtectedRoute.tsx"
    "master_src/hooks/useAuth.ts"
    "package.json"
    "tsconfig.json"
)

# Check dependencies in package.json
REQUIRED_DEPS=(
    "@aws-amplify/backend"
    "@aws-amplify/backend-cli"
    "aws-amplify"
    "react"
    "react-dom"
    "react-router-dom"
)

# Validate project structure
echo "Checking project structure..." | tee -a "$LOG_FILE"
for file in "${REQUIRED[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ Found $file" | tee -a "$LOG_FILE"
    else
        echo "✗ Missing $file" | tee -a "$LOG_FILE"
        exit 1
    fi
done
