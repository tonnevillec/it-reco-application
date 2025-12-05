#!/bin/bash

API_URL="https://127.0.0.1:8000/api/general_infos/1"
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQ3OTE1MzEsImV4cCI6MTc2NDc5NTEzMSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiYmVub2l0In0.HbBY7Xv6quyipc1LF2ZP5R24Ji316YSUSConC8j1Wzq_QFbhmMNNyeefyOyvUg2jybCg4CTMZhr8GYoSjVlPPEYl0-zqIZ35V8B9RDSNUGo_oyMi5T_74T5p7AkbmkWvguX78DPeIuikljX_g6E1wwA5GEVdwzds364DQ5tiebWXo9E8Z_V8Qwj6BAYKUES9uLoo6DUCkSvc1bpGdkISuDQUQvDRZeDEpNm76anakT74dqsE_OVONY7oXjBN8oWUgWyxeDyCoM6ToqlPamp7QENf4n6THBIhh93mYV7th4BNbuEbgN7kQF5I5MSOQ8cY9Z2v4Dm_t11a9-_wUBR4Jw"

# 1. Get current data
echo "Getting current data..."
curl -k -s -H "Accept: application/ld+json" -H "Authorization: Bearer $TOKEN" $API_URL > current.json

# 2. Add a document
echo "Adding a document..."
# Construct new JSON with added document
jq '.documents += [{"id": "test-doc-1", "name": "Test Doc", "date": "2023-10-27", "fileName": "test.txt", "fileUrl": "data:text/plain;base64,SGVsbG8gV29ybGQ="}]' current.json > payload.json

# 3. Send PUT request
echo "Sending PUT request..."
curl -k -s -X PUT -H "Content-Type: application/ld+json" -H "Authorization: Bearer $TOKEN" -d @payload.json $API_URL > response.json

# 4. Verify
echo "Verifying..."
curl -k -s -H "Accept: application/ld+json" -H "Authorization: Bearer $TOKEN" $API_URL > verify.json

# Check if document is present
if grep -q "test-doc-1" verify.json; then
    echo "SUCCESS: Document found in response."
else
    echo "FAILURE: Document NOT found in response."
    echo "Response:"
    cat verify.json
fi
