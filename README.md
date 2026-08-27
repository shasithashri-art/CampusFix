# CampusFix

A complaint-tracking platform for hostels, PGs, and shared residential spaces. Residents report issues, admins manage resolution, and complaints left unaddressed for too long are automatically flagged for attention.

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
## Screenshots

**Login**
<img width="954" height="486" alt="image" src="https://github.com/user-attachments/assets/080e3c28-7d17-4aa4-a4c3-61375cf84332" />

**Sign Up**
<img width="957" height="482" alt="image" src="https://github.com/user-attachments/assets/5147e6fb-e238-42f7-8d98-0beaaca725b5" />

**Dashboard — Resident view**
<img width="944" height="480" alt="image" src="https://github.com/user-attachments/assets/b2bd9a38-0744-45f8-b508-aecf561a37be" />

**Dashboard — Admin view (status controls) Auto-escalation in action**
<img width="942" height="482" alt="image" src="https://github.com/user-attachments/assets/e45bb708-10d7-4cc4-9d18-131e6e6e4379" />

