import requests
import json
import base64
import os
import time

API_URL = "https://127.0.0.1:8000/api/general_infos/1"
TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NjQ3OTE1MzEsImV4cCI6MTc2NDc5NTEzMSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiYmVub2l0In0.HbBY7Xv6quyipc1LF2ZP5R24Ji316YSUSConC8j1Wzq_QFbhmMNNyeefyOyvUg2jybCg4CTMZhr8GYoSjVlPPEYl0-zqIZ35V8B9RDSNUGo_oyMi5T_74T5p7AkbmkWvguX78DPeIuikljX_g6E1wwA5GEVdwzds364DQ5tiebWXo9E8Z_V8Qwj6BAYKUES9uLoo6DUCkSvc1bpGdkISuDQUQvDRZeDEpNm76anakT74dqsE_OVONY7oXjBN8oWUgWyxeDyCoM6ToqlPamp7QENf4n6THBIhh93mYV7th4BNbuEbgN7kQF5I5MSOQ8cY9Z2v4Dm_t11a9-_wUBR4Jw"

headers = {
    "Accept": "application/ld+json",
    "Content-Type": "application/ld+json",
    "Authorization": f"Bearer {TOKEN}"
}

# 1. Get current data
print("Getting current data...")
response = requests.get(API_URL, headers=headers, verify=False)
if response.status_code != 200:
    print(f"Failed to get data: {response.status_code}")
    print(response.text)
    exit(1)

current_data = response.json()

# 2. Prepare payload
print("Preparing payload...")
# Mimic frontend structure exactly
# id is Date.now().toString()
new_id = str(int(time.time() * 1000))
new_doc = {
    "id": new_id,
    "name": "Test Doc Frontend Style",
    "date": "2023-10-27",
    "fileName": "test_frontend.txt",
    "fileUrl": "data:text/plain;base64,SGVsbG8gV29ybGQ="
}

if "documents" not in current_data or current_data["documents"] is None:
    current_data["documents"] = []

# Append to existing documents
current_data["documents"].append(new_doc)

# Remove read-only fields that might cause issues
# The frontend removes: id, @id, @context, @type
payload = {k: v for k, v in current_data.items() if k not in ["id", "@id", "@context", "@type"]}

# 3. Send PUT request
print("Sending PUT request...")
response = requests.put(API_URL, headers=headers, json=payload, verify=False)

# 4. Verify
print(f"Response status: {response.status_code}")
if response.status_code == 200:
    print("SUCCESS: PUT request successful.")
    
    # Check PUT response body
    put_response_data = response.json()
    print("Checking PUT response body...")
    if "documents" in put_response_data and put_response_data["documents"]:
        print(f"PUT response contains {len(put_response_data['documents'])} documents.")
        # Check if our new doc is there
        found_in_put = False
        for doc in put_response_data["documents"]:
            if doc.get("id") == new_id:
                found_in_put = True
                break
        if found_in_put:
            print("SUCCESS: Document found in PUT response.")
        else:
            print("FAILURE: Document NOT found in PUT response.")
            print("Documents in PUT response:", json.dumps(put_response_data.get("documents"), indent=2))
    else:
        print("FAILURE: No documents in PUT response.")
        print("PUT Response keys:", put_response_data.keys())

    # Verify persistence
    print("Verifying persistence via GET...")
    verify_response = requests.get(API_URL, headers=headers, verify=False)
    verify_data = verify_response.json()
    
    found = False
    if "documents" in verify_data and verify_data["documents"]:
        for doc in verify_data["documents"]:
            if doc.get("id") == new_id:
                found = True
                break
    
    if found:
        print("SUCCESS: Document persisted.")
    else:
        print("FAILURE: Document NOT found in subsequent GET.")
        print("Documents found:", json.dumps(verify_data.get("documents"), indent=2))
else:
    print("FAILURE: PUT request failed.")
    print(response.text[:500])
