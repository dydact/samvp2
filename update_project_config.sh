#!/bin/bash
# update_project_config.sh

echo "Updating project configuration..."

# Update tsconfig.json
cat > tsconfig.json << EOL
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
EOL

# Update package.json scripts
jq '.scripts = {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "jest",
    "test:integration": "jest -c jest.integration.config.js",
    "amplify": "amplify",
    "amplify-push": "amplify push"
}' package.json > package.json.tmp && mv package.json.tmp package.json
