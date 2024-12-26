#!/bin/bash
# fix_paths.sh

echo "Fixing project paths..."

# Ensure correct directory structure
mkdir -p master_src/amplify/data

# Move resource.ts to correct location
if [ -f "master_src/master_src/master_src/amplify/data/resource.ts" ]; then
    mv master_src/master_src/master_src/amplify/data/resource.ts master_src/amplify/data/
    rm -rf master_src/master_src
fi

# Create resource.ts in correct location if it doesn't exist
cat > master_src/amplify/data/resource.ts << 'EOL'
import { type ClientSchema, defineData } from '@aws-amplify/backend';

export const schema = {
    models: {
        User: {
            attributes: {
                id: { type: 'string', required: true },
                email: { type: 'string', required: true },
                role: { 
                    type: 'string',
                    required: true,
                    validators: [
                        { type: 'enumeration', values: ['ADMIN', 'USER', 'CLIENT'] }
                    ]
                }
            }
        }
    }
} satisfies ClientSchema;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: 'userPool'
    }
});
EOL

# Update validate_project.sh with correct path
cat > validate_project.sh << 'EOL'
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
EOL

chmod +x validate_project.sh
