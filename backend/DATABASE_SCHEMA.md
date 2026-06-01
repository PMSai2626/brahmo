# Database Schema

## Users

| Field | Type |
|---------|---------|
| id | text |
| name | text |
| role | text |
| department | text |
| applicable_cohorts | text[] |

---

## Patients

| Field | Type |
|---------|---------|
| id | text |
| name | text |
| department | text |
| cohort_tags | text[] |

---

## Knowledge Questions

| Field | Type |
|---------|---------|
| id | text |
| hierarchy_level_id | text |
| question_text | text |
| cohort_tag | text |

---

## Question Answers

| Field | Type |
|---------|---------|
| id | text |
| question_id | text |
| answer_text | text |

---

## Knowledge Nodes

| Field | Type |
|---------|---------|
| id | text |
| type | text |
| title | text |
| content | text |
| hierarchy_level_id | text |
| importance | numeric |
| department | text |
