# API Documentation

Base URL

http://localhost:5000/api

---

# Users

GET /users

Response

[
  {
    "id":"U-MEERA",
    "name":"Dr. Meera"
  }
]

---

# Patients

GET /patients

Response

[
  {
    "id":"PAT-PADMA",
    "name":"Mrs. Padma"
  }
]

---

# Context

GET /context/:userId/:patientId

Example

/context/U-MEERA/PAT-PADMA

Returns

- User
- Patient
- Knowledge

---

# Compare

POST /compare

Request

{
  "userId":"U-ANANYA",
  "patientId":"PAT-PADMA",
  "question":"Can Padma continue fasting today?"
}

Response

{
  "hospitalKnowledge":[],
  "departmentKnowledge":[],
  "patientKnowledge":[]
}

---

# Ask

POST /ask

Request

{
  "userId":"U-ANANYA",
  "patientId":"PAT-RAJAN",
  "question":"Can Rajan take ibuprofen?"
}

Response

{
  "answer":"..."
}
