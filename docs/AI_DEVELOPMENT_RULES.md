# Orbit CRM - AI Development Rules

## Project Overview

Project Name: Orbit CRM

Orbit CRM is a modern SaaS-based Customer Relationship Management platform built using React, TypeScript, Tailwind CSS, Vite, Supabase Authentication, and PostgreSQL.

The application should feel like a premium commercial SaaS product rather than a college project.

---

# General Rules

- Always follow the Product Requirement Document (PRD).
- Never generate placeholder or incomplete code.
- Never remove existing functionality without explicit instruction.
- Keep the code modular and scalable.
- Prefer reusable components over duplicated code.
- Always write production-quality code.

---

# Frontend Rules

Use:

- React
- TypeScript
- Tailwind CSS
- Vite

Follow:

- Functional Components
- Hooks
- Responsive Design
- Mobile First
- Clean UI

Never use inline CSS.

---

# Folder Structure

Follow feature-based architecture.

Example:

src/
    components/
    features/
    layouts/
    pages/
    hooks/
    services/
    utils/
    lib/
    types/

Do not create unnecessary folders.

---

# Component Rules

Each component should:

- Have a single responsibility.
- Be reusable.
- Use proper TypeScript types.
- Export default only when appropriate.

Avoid large files.

---

# UI Rules

Design should look like a premium SaaS application.

Use:

- Clean spacing
- Modern typography
- Rounded cards
- Soft shadows
- Consistent colors
- Responsive layouts

Avoid clutter.

---

# Authentication

Use Supabase Authentication.

Support:

- Sign Up
- Login
- Forgot Password
- Email Verification
- Protected Routes

---

# Database

Use PostgreSQL via Supabase.

Follow relational database principles.

Every business table must include:

- id
- organization_id
- created_at
- updated_at

---

# Security

Always respect Role-Based Access Control.

Never expose unauthorized data.

Use Row Level Security.

---

# Code Quality

Write:

- Readable code
- Well-named variables
- Small functions
- Comments only where necessary

Avoid duplicated logic.

---

# Performance

Prefer:

- Lazy loading
- Code splitting
- Optimized rendering
- React Query caching

Avoid unnecessary re-renders.

---

# Git

Every completed feature should be committed separately using meaningful commit messages.

Example:

feat(auth): add login page

fix(customers): resolve customer search bug

refactor(tasks): improve task component

---

# Before Generating Code

Always:

1. Read the PRD.
2. Follow these AI Development Rules.
3. Understand the current project structure.
4. Only implement the requested feature.
5. Do not modify unrelated files.
