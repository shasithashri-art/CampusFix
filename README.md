# CampusFix

A complaint-tracking platform for hostels, PGs, and shared residential spaces — built to go beyond basic CRUD with a self-flagging accountability feature.

Most complaint trackers stop at "status: open." CampusFix automatically flags complaints that have gone unaddressed too long, so nothing silently sits unresolved.

## Features

- **Authentication** — JWT-based signup/login, passwords hashed with bcrypt
- **Role-based access** — residents report and view complaints; admins can additionally update status and delete entries. Admin accounts are never self-assignable through signup
- **Complaint management** — full CRUD: create, view, update status (Open → In Progress → Resolved), delete
- **Auto-escalation** — any complaint left "Open" for more than 24 hours is automatically flagged as "Escalated," computed live on every fetch
- **Shared visibility** — all residents see all complaints, making it a transparent community registry rather than a private inbox

## Tech Stack

React (Vite) · Tailwind CSS · Node.js · Express · PostgreSQL · JWT · bcrypt

## Setup

1. Clone the repo and install dependencies in both `backend/` and `frontend/` with `npm install`
2. Create a PostgreSQL database named `campusfix` with `users` and `complaints` tables (schema in `/backend/db.js` and route files)
3. Add a `.env` file in `backend/` with your database credentials
4. Run `node server.js` in `backend/` and `npm run dev` in `frontend/`

## Roadmap

- Lost & found module
- Per-category SLA configuration
- Admin analytics dashboard
- Real-time notifications
