🧠 Mini Q&A App

A collaborative Question & Answer platform for teams — with Manager Insights, Stylish Frontend, and Powerful Backend.

📘 Table of Contents

Overview

Features

Tech Stack

Folder Structure

Installation & Setup

Backend Setup

Frontend Setup

Environment Variables

API Endpoints

Running the App

Project Screenshots

Future Enhancements

License

🧩 Overview

The Mini Q&A App is an advanced-level project where:

Team Members can ask questions.

Other Members can answer.

Managers can view insights and analytics.

It includes a modern frontend UI (React) and a powerful backend (Node.js + Express + MongoDB).
The project demonstrates full-stack development, authentication, API integration, and data visualization.

✨ Features
👤 For Team Members

Post questions with tags and categories.

Answer questions from others.

Edit or delete your posts.

🧑‍💼 For Managers

View insights and activity statistics.

See most active users and popular questions.

💎 General

JWT Authentication

RESTful APIs

MongoDB Database

Attractive, responsive React UI

Axios integration with backend

Role-based access control

⚙️ Tech Stack
🖥 Frontend

React.js

Axios

React Router DOM

TailwindCSS / Custom CSS

Chart.js (for insights)

⚙️ Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

bcrypt for password hashing

dotenv for environment management

📁 Folder Structure
Mini-QA-App/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── questionController.js
│   │   └── answerController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Question.js
│   │   └── Answer.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── questionRoutes.js
│   │   └── answerRoutes.js
│   └── utils/
│       └── token.js
│
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── api/
│       │   └── axiosConfig.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── QuestionCard.jsx
│       │   └── InsightChart.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── AskQuestion.jsx
│       │   └── AnswerPage.jsx
│       └── styles/
│           ├── Login.css
│           ├── Dashboard.css
│           └── index.css
│
└── README.md

🚀 Installation & Setup
🧱 Backend Setup
cd backend
npm install

Run Backend
npm start


or with nodemon:

npm run dev


Backend runs by default on:
👉 http://localhost:5000

💻 Frontend Setup
cd frontend
npm install
npm start


Frontend runs by default on:
👉 http://localhost:3000

🔐 Environment Variables

Create a .env file inside /backend folder:

PORT=5000
MONGO_URI=mongodb+srv://<your-mongodb-url>
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

🧠 API Endpoints
🔸 Auth Routes
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user & return token
🔸 Question Routes
Method	Endpoint	Description
POST	/api/questions	Create a question
GET	/api/questions	Get all questions
GET	/api/questions/:id	Get a single question
PUT	/api/questions/:id	Update question
DELETE	/api/questions/:id	Delete question
🔸 Answer Routes
Method	Endpoint	Description
POST	/api/answers/:questionId	Add answer to a question
GET	/api/answers/:questionId	Get all answers for a question
DELETE	/api/answers/:id	Delete an answer
🧰 Running the App

Start MongoDB (or use MongoDB Atlas)

Run Backend:

cd backend
npm run dev


Run Frontend:

cd frontend
npm start


Access Application:
Open your browser → http://localhost:3000

📊 Manager Insights (Dashboard)

Managers can:

See number of questions asked

View top contributors

Analyze team engagement with charts

Example chart:

<Bar data={chartData} options={options} />

🖼 Project Screenshots
Login Page	Dashboard	Ask Question

	
	
🧩 Future Enhancements

Add real-time chat for Q&A discussions

Add upvote/downvote functionality

Notification system for answers

Enhanced analytics dashboard

Docker setup for full deployment

📄 License

This project is licensed under the MIT License.
Feel free to use, modify, and share with attribution.