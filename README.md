# Note-Taking App

A full-stack, mobile-friendly note-taking application with email/OTP and Google OAuth authentication, built with React (TypeScript), Node.js (TypeScript), and MongoDB.

## Features
- Sign up and log in with email/OTP or Google account
- Input validation and error messages for all flows
- Welcome page with user info after login/signup
- Create and delete notes (JWT-protected)
- Responsive, modern UI (design assets included)
- Secure: secrets and build artifacts are git-ignored

## Tech Stack
- **Frontend:** ReactJS (TypeScript), Vite, MUI, Redux Toolkit, React Router
- **Backend:** Node.js (TypeScript), Express, Mongoose, JWT, Passport (Google OAuth), Nodemailer
- **Database:** MongoDB

## Getting Started

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd Login-Master
```

### 2. Setup Environment Variables
- Copy `.env.example` to `.env` in both `backend/` and `frontend/`.
- Fill in your secrets (see `.env.example` for required keys).

### 3. Install Dependencies
```sh
cd backend
npm install
cd ../frontend
npm install
```

### 4. Run the App Locally
- **Backend:**
	```sh
	cd backend
	npm run dev
	```
- **Frontend:**
	```sh
	cd frontend
	npm run dev
	```
- Open your browser to the port shown by Vite (e.g., http://localhost:5173/)

### 5. Build for Production
- **Backend:**
	```sh
	cd backend
	npm run build
	```
- **Frontend:**
	```sh
	cd frontend
	npm run build
	```

## Deployment
- Deploy backend and frontend to your preferred cloud provider (e.g., Vercel, Netlify, Heroku, Render, etc.)
- Set environment variables in your deployment dashboard.

## Project Structure
```
Login-Master/
├── backend/
│   ├── src/
│   ├── .env.example
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── ...
├── .gitignore
└── README.md
```

## Security
- **Never commit `.env` files or secrets.**
- All sensitive files and build artifacts are git-ignored.

## License
MIT

---
**For any issues, open an issue or contact the maintainer.**
# Login-Master