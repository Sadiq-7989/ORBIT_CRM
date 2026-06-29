# Orbit CRM - Product Requirements Document (PRD)

## 1. Product Overview
**Product Name:** Orbit CRM

**Tagline:** Manage Customers. Close Deals. Drive Growth.

Orbit CRM is a modern SaaS-based Customer Relationship Management (CRM) platform designed for startups and small businesses. It provides secure workspaces, customer management, sales pipeline tracking, task management, analytics dashboards, and role-based collaboration.

## 2. Objectives
- Centralize customer information.
- Improve sales pipeline visibility.
- Enable team collaboration.
- Track tasks and activities.
- Deliver a responsive, professional SaaS experience.

## 3. Target Users
- Startup founders
- Sales managers
- Team members
- Customer support teams
- Small and medium businesses

## 4. User Roles
### Admin
- Manage organization
- Invite users
- Full CRUD permissions
### Manager
- Manage customers, deals and tasks
### Team Member
- View assigned work and update task status

## 5. Core Modules
### Authentication
- Sign Up
- Login
- Forgot Password
- Email Verification
- Protected Routes

### Workspace
- Organization creation
- Team invitations
- Role management

### Customer Management
- Create, Read, Update, Delete customers
- Customer profile
- Status: Lead, Active, Closed
- Notes and search

### Deal Management
Stages:
- New
- Contacted
- Negotiation
- Won
- Lost

Includes deal value and expected closing date.

### Task Management
- Assign tasks
- Priority
- Due dates
- Status tracking

### Dashboard
- Total customers
- Active deals
- Pending tasks
- Team activity
- Revenue summary
- Charts

## 6. Optional Premium Features
- Global search
- CSV export
- Activity timeline
- Notifications
- Dark mode
- Responsive UI
- Drag-and-drop Kanban pipeline

## 7. Functional Requirements
- Secure authentication
- Multi-tenant workspaces
- CRUD operations
- Role-based authorization
- Dashboard analytics
- Filtering and sorting

## 8. Non-Functional Requirements
- Responsive
- Fast loading
- Secure
- Scalable
- Accessible
- Maintainable code

## 9. Tech Stack
Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS

Backend:
- Supabase

Database:
- PostgreSQL

Deployment:
- Vercel
- Supabase

Version Control:
- GitHub

## 10. Database Entities
- organizations
- users
- customers
- deals
- tasks
- activities

Relationships:
Organization -> Users
Organization -> Customers
Customer -> Deals
Deal -> Tasks

## 11. Security
- Row Level Security
- JWT Authentication
- Role-based permissions
- Input validation

## 12. UI Principles
- Modern SaaS design
- Clean typography
- Responsive layout
- Reusable components
- Consistent spacing

## 13. Success Metrics
- Fast customer management
- Improved task tracking
- Reliable collaboration
- Responsive performance

## 14. Future Roadmap
- AI assistant
- Email integration
- Calendar sync
- Reports
- Mobile app

## 15. Milestones
1. Project setup
2. Authentication
3. Workspace
4. Dashboard
5. Customer module
6. Deal pipeline
7. Task management
8. Testing
9. Deployment
10. Documentation
