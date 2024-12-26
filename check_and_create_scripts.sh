#!/bin/bash
# check_and_create_scripts.sh

# Create validate_project.sh if it doesn't exist
if [ ! -f "validate_project.sh" ]; then
    echo "Creating validate_project.sh..."
    cat > validate_project.sh << 'EOL'
#!/bin/bash
echo "Validating project structure..."
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

for file in "${REQUIRED[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ Found $file"
    else
        echo "✗ Missing $file"
        exit 1
    fi
done
EOL
    chmod +x validate_project.sh
fi

# Create update_project_config.sh if it doesn't exist
if [ ! -f "update_project_config.sh" ]; then
    echo "Creating update_project_config.sh..."
    cat > update_project_config.sh << 'EOL'
#!/bin/bash
echo "Updating project configuration..."

# Update tsconfig.json
cat > tsconfig.json << 'CONFIG'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./master_src/*"]
    }
  },
  "include": ["master_src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
CONFIG
EOL
    chmod +x update_project_config.sh
fi

# Create setup_dev_env.sh if it doesn't exist
if [ ! -f "setup_dev_env.sh" ]; then
    echo "Creating setup_dev_env.sh..."
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
        
    # Add development dependencies
    npm install --save-dev \
        typescript \
        @types/react \
        @types/react-dom \
        @testing-library/react \
        @testing-library/jest-dom \
        jest
fi
EOL
    chmod +x setup_dev_env.sh
fi

# Create docs directory and CoT file if they don't exist
mkdir -p docs
if [ ! -f "docs/ongoing_cot.md" ]; then
    echo "Creating Chain of Thought documentation..."
    cat > docs/ongoing_cot.md << 'EOL'
# Chain of Thought Documentation

## Project Status Update [$(date +%Y-%m-%d)]

### Completed Tasks
- Consolidated source directories
- Updated project configuration
- Set up development environment
- Validated project structure

### Next Steps
1. Integrate Healthcare-CRM features
   - Patient management
   - Appointment scheduling
   - Medical records

2. Integrate GoAlert features
   - Alert system
   - On-call scheduling
   - Escalation policies

3. Integrate HospitalRun features
   - Inventory management
   - Lab orders
   - Medication tracking

### Current Focus
- Service integration
- Data model consolidation
- Authentication flow enhancement
EOL
fi

echo "All necessary scripts have been created."
