# FinTrack – Expense Tracker

A full-stack expense tracking application built with React, Node.js, Express, and PostgreSQL. FinTrack helps users record, manage, and analyze their daily expenses through a clean and intuitive dashboard.

## 🚀 Live Demo

- **Frontend:** https://fin-track-abc-f83d.vercel.app
- **Backend:** https://fintrack-api-da0c.onrender.com

## ✨ Features

- **User Authentication:** Secure registration and login using JWT authentication and HTTP-only cookies.
- **Expense Management:** Add, edit, and delete expenses.
- **Transaction History:** View and manage all recorded transactions.
- **Analytics Dashboard:** Visualize spending patterns through interactive charts.
- **Category-based Tracking:** Organize expenses into different categories.
- **Spending Insights:** Analyze monthly and quarterly spending.
- **Responsive Design:** Clean interface designed for different screen sizes.
- **Protected Routes:** Restrict access to authenticated users.

## 🛠️ Tech Stack

### Frontend
- React
- JavaScript
- Vite
- React Router
- Recharts
- CSS

### Backend
- Node.js
- Express.js
- PostgreSQL
- JSON Web Tokens (JWT)
- bcrypt
- Cookie Parser

### Deployment & Infrastructure
- Vercel – Frontend hosting
- Render – Backend hosting
- Neon – PostgreSQL database
- GitHub – Version control

## 📁 Project Structure

```text
FinTrack/
│
├── src/
│   ├── pages/
│   │   ├── auth/
│   │   └── dashboard/
│   ├── App.jsx
│   └── main.jsx
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── db/
│   └── app.js
│
├── package.json
├── vercel.json
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/nikhil476/FinTrack.git
```

### 2. Navigate into the project

```bash
cd FinTrack
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secure_random_secret
```

Never commit your `.env` file or expose your credentials.

### 5. Start the backend

```bash
npm start
```

### 6. Start the frontend

Open another terminal:

```bash
npm run dev
```

The frontend will run at:

`http://localhost:5173`

The backend will run at:

`http://localhost:3000`

## 🗄️ Database

FinTrack uses PostgreSQL to store user accounts and expenses.

The database contains two primary tables:

- `users` – Stores user account information and hashed passwords.
- `expenses` – Stores expense records associated with individual users.

Each expense is linked to its respective user.

## 🔐 Security

- Passwords are hashed using bcrypt.
- Authentication uses JWT.
- JWT tokens are stored in HTTP-only cookies.
- Protected API routes require authentication.
- Expense operations are scoped to the authenticated user.

## 👨‍💻 Author

**Nikh