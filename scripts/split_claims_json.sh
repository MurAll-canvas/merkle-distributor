#!/bin/bash

# Notes:
# install jq first with 'brew install jq', and install zip with 'sudo apt install zip unzip'
# Split claims from generated JSON into multiple files in a folder named "claims". Uses jq.

# Usage
# ./split_json.sh /path/to/json/file

file="$1"
VAR=$(pwd)
OUTPUT_DIR="claims"

# Extract the base name of the file without the extension
base_name=$(basename "$file" .json)

if [ ! -d ${OUTPUT_DIR} ]
then
    mkdir -p ${OUTPUT_DIR}
fi

jq -cr '.claims | keys[] as $k | "\($k)\t\(.[$k])"' "$file"  | awk -F\\t '{ file="claims/"$1".json"; print $2 > file; close(file); }'

# Create the zip file with the base name
zip -r "${base_name}_claims.zip" ${OUTPUT_DIR}
echo "Successfully split claims - saved to 'claims' folder"

# Extract merkleRoot and tokenTotal
jq '{merkleRoot: .merkleRoot, tokenTotal: .tokenTotal}' "$file" > "${base_name}_metadata.json"
echo "Successfully extracted merkleRoot and tokenTotal to ${base_name}_metadata.json"
