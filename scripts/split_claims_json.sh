#!/bin/bash

# Notes:
# install jq first with 'brew install jq'
# Split claims from generated JSON into multiple files in a folder named "claims". Uses jq.

# Usage
# ./split_json.sh /path/to/json/file

file="$1"
VAR=$(pwd)
OUTPUT_DIR="claims"

if [ ! -d ${OUTPUT_DIR} ]
then
    mkdir -p ${OUTPUT_DIR}
fi

jq -cr '.claims | keys[] as $k | "\($k)\t\(.[$k])"' "$file"  | awk -F\\t '{ file="claims/"$1".json"; print $2 > file; close(file); }'

echo "Successfully split claims - saved to 'claims' folder"
