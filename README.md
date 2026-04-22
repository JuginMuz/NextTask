🚀 NextTask – Inclusive Productivity Web App

NextTask is an accessibility-first productivity web application designed to support users with ADHD traits and visual accessibility needs. It focuses on reducing cognitive load, improving task clarity, and supporting sustained focus through simple, structured workflows.


## Project Overview

Many existing productivity tools rely on complex interfaces, long task lists, and colour-dependent feedback, which can be overwhelming or inaccessible for some users.

NextTask addresses these challenges by:

- Breaking tasks into small, manageable micro-tasks
- Providing distraction-free focus sessions
- Using accessible, non–colour-dependent feedback
- Prioritising clarity, simplicity, and usability

This project was developed as part of a Final Year Project in Web Design and Development.


## Key Features
- User Authentication
Secure registration and login using JWT
- Project Management
Create and manage multiple projects
- Task Management
Add, complete, and organise micro-tasks
- Focus Session Timer
Distraction-reduced mode to improve concentration
Real-time countdown with clear visual feedback
- Accessibility Features
High-contrast design
Non–colour-dependent task indicators
Simple, consistent layouts


## Tech Stack
Frontend
- React.js
- Tailwind CSS
Backend
- Node.js
- Express.js
Database
- PostgreSQL
- Prisma ORM
Other
- JWT Authentication
- RESTful API architecture


## Design Principles

NextTask is built around:
- Accessibility-first design (WCAG 2.2 aligned)
- User-centred design
- Reduced cognitive load
- Clear feedback and structure


## Evaluation

The system was evaluated through:

- Think-aloud usability testing (6 participants)
- Functional testing
- Accessibility testing (Google Lighthouse)

Key Findings:

- Users found the interface clear and easy to use
- Micro-tasking improved task initiation and completion
- Focus sessions helped reduce distraction
- Accessibility features improved readability and usability


## Limitations

Not fully optimised for mobile devices
Limited feature set (no notifications/reminders yet)
Small evaluation sample size


## Future Improvements

- Mobile responsiveness
- Notifications and reminders
- User customisation options
- AI-assisted task breakdown and support
- Advanced evaluation and analytics


## Installation & Setup

1. Clone the repository

git clone https://github.com/JuginMuz/NextTask.git
cd NextTask

2. Install dependencies

Frontend:

cd apps/web
npm install

Backend:

cd apps/api
npm install

3. Environment Variables

Create a .env file in the backend folder:

DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key

4. Run the application

Backend:

cd apps/api
npm run dev

Frontend:

cd apps/web
npm run dev


## Project Structure

NextTask/
├── apps/
│   ├── api/                    # Backend (Node.js + Express + Prisma)
│   │   ├── prisma/             # Prisma schema and database configuration
│   │   ├── src/                # API source code (routes, controllers, logic)
│   │   ├── .env                # Environment variables
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── ...
│   │
│   └── web/                    # Frontend (React + Vite + Tailwind CSS)
│       ├── public/             # Static assets
│       ├── src/                # React components, pages, logic
│       ├── index.html
│       ├── package.json
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       └── ...
│
├── docs/                       # Project documentation (report, diagrams, etc.)
├── README.md                   # Main project README


## Author

Jugin Muzhaqi
Final Year Project – University of Roehampton


## Note

This project will continue to be developed after graduation, with a focus on improving accessibility, expanding features, and refining the overall user experience.