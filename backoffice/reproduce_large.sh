#!/bin/bash

API_URL="https://127.0.0.1:8000/api/general_infos/1"
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQ3OTE1MzEsImV4cCI6MTc2NDc5NTEzMSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiYmVub2l0In0.HbBY7Xv6quyipc1LF2ZP5R24Ji316YSUSConC8j1Wzq_QFbhmMNNyeefyOyvUg2jybCg4CTMZhr8GYoSjVlPPEYl0-zqIZ35V8B9RDSNUGo_oyMi5T_74T5p7AkbmkWvguX78DPeIuikljX_g6E1wwA5GEVdwzds364DQ5tiebWXo9E8Z_V8Qwj6BAYKUES9uLoo6DUCkSvc1bpGdkISuDQUQvDRZeDEpNm76anakT74dqsE_OVONY7oXjBN8oWUgWyxeDyCoM6ToqlPamp7QENf4n6THBIhh93mYV7th4BNbuEbgN7kQF5I5MSOQ8cY9Z2v4Dm_t11a9-_wUBR4Jw"

# 1. Get current data
echo "Getting current data..."
curl -k -s -H "Accept: application/ld+json" -H "Authorization: Bearer $TOKEN" $API_URL > current.json

# 2. Prepare large payload
echo "Preparing large payload..."
# Strip newlines from base64 file
tr -d '\n' < large_file.b64 > large_file_clean.b64

echo '{"id": "test-doc-large", "name": "Large Doc", "date": "2023-10-27", "fileName": "large.bin", "fileUrl": "data:application/octet-stream;base64,' > large_doc_part.json
cat large_file_clean.b64 >> large_doc_part.json
echo '"}' >> large_doc_part.json

# Combine
jq -s '.[0].documents += [.[1]] | .[0]' current.json large_doc_part.json > payload_large.json

# 3. Send PUT request
echo "Sending PUT request..."
curl -k -s -X PUT -H "Content-Type: application/ld+json" -H "Authorization: Bearer $TOKEN" -d @payload_large.json $API_URL > response_large.json

# 4. Verify
echo "Verifying..."
# Check response code or content
if grep -q "test-doc-large" response_large.json; then
    echo "SUCCESS: Large document found in response."
else
    echo "FAILURE: Large document NOT found in response."
    echo "Response start:"
    head -c 500 response_large.json
fi
