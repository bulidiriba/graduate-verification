
## Sample Request to add university
From postman
- Select Post
- In the URl, type /add_university
- In the headers, set "Content-Type" to "application/json"
- In the body, select "raw", then "JSON" and the ff json

{
  "name": "Adama University",
  "public_key": "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6RVxRnSH3ofHQfrY8kSZ8BViUDVYBFJ6AIK6XlXtmaXlkOD5w+csAMyA4T880oYe/wButHchDWe2jKmsN5BxccQVu3iEUbF4D6bJjxUIRpNHEDkI+ciwEjRcvwMvx+85qC7hZ+0RQzbKaRMtcuCdlVCOjo45BEEiXYpCUNDnuQXko0Vh3Ysq+uJKYOwjaNN9yNUQTIDWtA66BD38QRKxHPxXc/1UsIvOiYZFKXjro6ndUrwPbu0r6/0MobvmZgB+55Cpo7tRJ+4XBBU+EauSLNE5F3qxw9MtK91ZXBcQwnTq1VT0j1pet9wjmkf0Cl2TNHpHb2tCw7ey7eLwrH2PfwIDAQAB-----END PUBLIC KEY-----"
}

public key is the one generated.

## Sample Request to add graduate

From postman
- Select Post
- In the URl, type /add_graduate
- In the headers, set "Content-Type" to "application/json"
- In the body, select "raw", then "JSON" and the ff json

{
  "university": "Adama University",
  "data": {
    "name": "Alice Smith",
    "degree": "BSc Computer Science",
    "year": 2024
  },
  "signature": "LNgZi+oMoHqDosUYRqadomzq3pjHj6wrl+tKFEfzs6+uKC5exydQklHEos9VCDg4BB7yzGtcZ8OVnWXIF3e9XAR9yXCl4wGlX/Op8K8HczbjHYG8tVlGDibdKUtgY7jOSss/7J5SKLjgbgEkW90NF/1aM01T03Eo4MtatIwGD1kNM1fBQAw/ITI1YlSlZPKVRvZ71GcmFoU+MG/nC6J6uIb991kJVOmov+62ltJJJg/mokwNE1e0ZbYXsjUZwBcHnLCPHIexikLSVsVBkwFCkjgBzY8jWMZbeNBcActdISXz5ipg6/tZjeSbrFZc0qXmwRTutFxBw2qfhnCKsqfiVQ=="
}

(signature is the one generated, from private key, not the one generated while adding universtiy)

## Sample Request to verify graduates, with name, university and year

curl -X POST http://localhost:5000/verify_graduate_by_details \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Alice Smith",
        "university": "Adama University",
        "year": 2024
      }'


From postman
- In the headers, set "Content-Type" to "application/json"
- In the body, select "raw", then "JSON" and the ff json
{
    "name": "Alice Smith",
    "university": "Adama University",
    "year": 2024
}