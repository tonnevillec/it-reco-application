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

def test_upload(name, filename, mime_type, content_bytes):
    print(f"\nTesting upload: {name} ({filename})")
    
    # Get current
    response = requests.get(API_URL, headers=headers, verify=False)
    if response.status_code != 200:
        print("Failed to get data")
        return False
    current_data = response.json()
    
    # Prepare payload
    b64_content = base64.b64encode(content_bytes).decode('utf-8')
    new_doc = {
        "id": str(int(time.time() * 1000)),
        "name": name,
        "date": "2023-10-27",
        "fileName": filename,
        "fileUrl": f"data:{mime_type};base64,{b64_content}"
    }
    
    if "documents" not in current_data or current_data["documents"] is None:
        current_data["documents"] = []
    
    current_data["documents"].append(new_doc)
    
    payload = {k: v for k, v in current_data.items() if k not in ["id", "@id", "@context", "@type"]}
    
    # Send PUT
    response = requests.put(API_URL, headers=headers, json=payload, verify=False)
    
    if response.status_code == 200:
        print("PUT success")
        # Verify
        resp_data = response.json()
        found = False
        if "documents" in resp_data:
            for doc in resp_data["documents"]:
                if doc.get("id") == new_doc["id"]:
                    found = True
                    break
        if found:
            print("SUCCESS: Document persisted")
            return True
        else:
            print("FAILURE: Document not found in response")
            return False
    else:
        print(f"FAILURE: PUT failed with {response.status_code}")
        print(response.text[:200])
        return False

# Test 1: PDF file
test_upload("Test PDF", "test.pdf", "application/pdf", b"%PDF-1.4...")

# Test 2: Special chars in filename
test_upload("Test Accents", "tést file @#.txt", "text/plain", b"content")

# Test 3: Empty file
test_upload("Test Empty", "empty.txt", "text/plain", b"")

# Test 4: Large file (4MB - just under limit)
test_upload("Test 4MB", "large_4mb.bin", "application/octet-stream", os.urandom(4 * 1024 * 1024))
