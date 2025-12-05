import requests
import json
import base64
import os

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

# 2. Prepare large payload
print("Preparing large payload...")
# Create 5MB random data
large_data = os.urandom(5 * 1024 * 1024)
large_b64 = base64.b64encode(large_data).decode('utf-8')

new_doc = {
    "id": "test-doc-large-py",
    "name": "Large Doc Py",
    "date": "2023-10-27",
    "fileName": "large_py.bin",
    "fileUrl": f"data:application/octet-stream;base64,{large_b64}"
}

if "documents" not in current_data or current_data["documents"] is None:
    current_data["documents"] = []

current_data["documents"].append(new_doc)

# Remove read-only fields that might cause issues if sent back
# API Platform usually ignores them, but let's be safe
# But we need to keep the ID of the resource itself if we want to update it?
# Actually PUT to /id usually doesn't need ID in body.
# But let's just send what we got + new doc.

# 3. Send PUT request
print("Sending PUT request...")
response = requests.put(API_URL, headers=headers, json=current_data, verify=False)

# 4. Verify
print(f"Response status: {response.status_code}")
if response.status_code == 200:
    print("SUCCESS: PUT request successful.")
    # Check if document is in response
    resp_data = response.json()
    found = False
    if "documents" in resp_data and resp_data["documents"]:
        for doc in resp_data["documents"]:
            if doc.get("id") == "test-doc-large-py":
                found = True
                break
    
    if found:
        print("SUCCESS: Large document found in response.")
    else:
        print("FAILURE: Large document NOT found in response.")
else:
    print("FAILURE: PUT request failed.")
    print(response.text[:500])
