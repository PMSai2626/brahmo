# Deployment Guide

## Backend

Install dependencies

npm install

Create .env

PORT=5000

SUPABASE_URL=your_url

SUPABASE_KEY=your_key

GEMINI_API_KEY=your_key

Run

npm run dev

---

## Frontend

Install dependencies

npm install

Create .env.local

NEXT_PUBLIC_API_URL=http://localhost:5000/api

Run

npm run dev

---

## Production

Frontend

Deploy to Vercel

Backend

Deploy to Render

Database

Supabase

AI

Google Gemini
