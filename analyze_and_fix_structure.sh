#!/bin/bash
# analyze_and_fix_structure.sh

LOG_FILE="project_analysis.log"
STRUCTURE_MAP="project_structure.json"
echo "Starting project analysis at $(date)" > "$LOG_FILE"

# Function to create JSON structure map
create_structure_map() {
    echo "Mapping project structure..." | tee -a "$LOG_FILE"
    
    # Create a JSON representation of the project structure
    {
        echo "{"
        echo "  \"directories\": {"
        
        # Find all directories
        find . -type d -not -path "*/\.*" -not -path "*/node_modules*" | \
        while read -r dir; do
            # Clean up path
            clean_dir=${dir#./}
            [ -z "$clean_dir" ] && continue
            
            echo "    \"$clean_dir\": {"
            echo "      \"files\": ["
            
            # Find files in directory
            find "$dir" -maxdepth 1 -type f -not -path "*/\.*" | \
            while read -r file; do
                filename=${file##*/}
                echo "        \"$filename\","
            done | sed '$ s/,$//'
            
            echo "      ]"
            echo "    },"
        done | sed '$ s/,$//'
        
        echo "  },"
        
        # Add source directories section
        echo "  \"sourceDirectories\": ["
        for dir in "SAMVPquick/src" "SiteAware/shared/src" "src" "master_src"; do
            if [ -d "$dir" ]; then
                echo "    \"$dir\","
            fi
        done | sed '$ s/,$//'
        echo "  ]"
        
        echo "}"
    } > "$STRUCTURE_MAP"
}

# Function to analyze project structure
analyze_structure() {
    echo "Analyzing project structure..." | tee -a "$LOG_FILE"
    
    # Check for multiple source directories
    src_dirs=$(jq -r '.sourceDirectories | length' "$STRUCTURE_MAP")
    echo "Found $src_dirs source directories" | tee -a "$LOG_FILE"
    
    # Check for critical files
    critical_files=(
        "AuthContext.tsx"
        "resource.ts"
        "ProtectedRoute.tsx"
        "useAuth.ts"
    )
    
    echo "Checking for critical files..." | tee -a "$LOG_FILE"
    for file in "${critical_files[@]}"; do
        locations=$(jq -r --arg file "$file" '.directories[][] | select(contains([$file])) | $file' "$STRUCTURE_MAP")
        if [ ! -z "$locations" ]; then
            echo "Found $file in multiple locations:" | tee -a "$LOG_FILE"
            echo "$locations" | tee -a "$LOG_FILE"
        else
            echo "Missing critical file: $file" | tee -a "$LOG_FILE"
        fi
    done
    
    # Return analysis results
    if [ "$src_dirs" -gt 1 ]; then
        echo "NEEDS_CONSOLIDATION"
    else
        echo "STRUCTURE_OK"
    fi
}

# Function to plan directory structure changes
plan_changes() {
    echo "Planning directory structure changes..." | tee -a "$LOG_FILE"
    
    # Create changes plan
    {
        echo "{"
        echo "  \"moves\": ["
        
        # Plan moves for each critical file
        jq -r '.directories | to_entries[] | select(.value.files[]) | "\(.key)/\(.value.files[])"' "$STRUCTURE_MAP" | \
        while read -r filepath; do
            if [[ $filepath =~ .*\.(ts|tsx)$ ]]; then
                target_dir="master_src"
                case "$filepath" in
                    *"/context/"*) target_dir="$target_dir/context" ;;
                    *"/components/"*) target_dir="$target_dir/components" ;;
                    *"/hooks/"*) target_dir="$target_dir/hooks" ;;
                    *"/amplify/"*) target_dir="$target_dir/amplify" ;;
                    *) target_dir="$target_dir/$(dirname "$filepath")" ;;
                esac
                echo "    {"
                echo "      \"from\": \"$filepath\","
                echo "      \"to\": \"$target_dir/$(basename "$filepath")\""
                echo "    },"
            fi
        done | sed '$ s/,$//'
        
        echo "  ]"
        echo "}"
    } > "structure_changes.json"
}

# Function to execute planned changes
execute_changes() {
    echo "Executing planned changes..." | tee -a "$LOG_FILE"
    
    # Create master_src directory if it doesn't exist
    mkdir -p master_src/{context,components,hooks,amplify/data}
    
    # Execute moves from the plan
    jq -r '.moves[] | "\(.from)|\(.to)"' structure_changes.json | \
    while IFS='|' read -r from to; do
        mkdir -p "$(dirname "$to")"
        if [ -f "$from" ]; then
            echo "Moving $from to $to" | tee -a "$LOG_FILE"
            cp "$from" "$to"
        fi
    done
}

# Main execution flow
create_structure_map

status=$(analyze_structure)
echo "Analysis Status: $status" | tee -a "$LOG_FILE"

if [ "$status" = "NEEDS_CONSOLIDATION" ]; then
    echo "Planning changes..." | tee -a "$LOG_FILE"
    plan_changes
    
    echo "Review planned changes in structure_changes.json"
    echo "Proceed with changes? (y/n)"
    read -r proceed
    
    if [ "$proceed" = "y" ]; then
        execute_changes
        echo "Changes completed. Please review the new structure." | tee -a "$LOG_FILE"
    else
        echo "Changes aborted." | tee -a "$LOG_FILE"
    fi
else
    echo "Project structure is already consolidated." | tee -a "$LOG_FILE"
fi

# Output final structure
echo "Final project structure:" | tee -a "$LOG_FILE"
tree master_src --noreport | tee -a "$LOG_FILE"
