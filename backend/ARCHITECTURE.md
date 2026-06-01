# BRAHMO Architecture

## High Level Flow

Doctor
↓
Select Patient
↓
Ask Question
↓
Backend API
↓
Knowledge Retrieval
↓
Hospital Knowledge
Department Knowledge
Patient Knowledge
↓
Prompt Builder
↓
Gemini
↓
AI Recommendation
↓
Frontend

---

## Knowledge Hierarchy

### Level 1

Hospital Knowledge

Examples:

- Safety Policies
- Medication Constraints
- Organization Guidelines

### Level 2

Department Knowledge

Examples:

- Diabetes Protocols
- Orthopedic Rules
- Department Procedures

### Level 3

Patient Knowledge

Examples:

- Medication Adjustments
- Personalized Instructions
- Treatment Decisions

---

## Context Injection

The retrieved knowledge is combined and injected into the LLM prompt before answer generation.

This ensures recommendations remain aligned with organizational policies.