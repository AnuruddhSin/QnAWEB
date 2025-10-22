# 🧠 Mini Q&A App

A collaborative **Question & Answer platform** for teams — with **Manager Insights**, **Stylish Frontend**, and **Backend**.

---

## 📘 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Installation & Setup](#-installation--setup)
  - [Backend Setup](#-backend-setup)
  - [Frontend Setup](#-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Running the App](#-running-the-app)
- [Manager Insights](#-manager-insights-dashboard)
- [Project Screenshots](#-project-screenshots)
- [Future Enhancements](#-future-enhancements)
---

## 🧩 Overview

The **Mini Q&A App** is an **full-stack project** built for collaborative learning and communication within teams.

- 🧑‍🤝‍🧑 **Team Members** can ask questions and answer others.
- 🧑‍💼 **Managers** can view detailed insights and activity analytics.
- 💡 Built using **React**, **Node.js**, and **MongoDB**, it demonstrates authentication, RESTful APIs, data visualization, and responsive UI design.

---

## ✨ Features

### 👤 For Team Members
- Post questions with tags and categories  
- Answer other users' questions    

### 🧑‍💼 For Managers
- View insights and activity statistics  
- See most active users and popular questions
- Edit or delete your posts 

### 💎 General
- JWT Authentication  
- RESTful APIs  
- MongoDB Database  
- Responsive React UI  
- Axios integration with backend  
- Role-based access control  

---

## ⚙️ Tech Stack

### 🖥 Frontend
- React.js  
- Axios  
- React Router DOM  
- TailwindCSS / Custom CSS  
- Chart.js (for insights visualization)

### ⚙️ Backend
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- bcrypt for password hashing  
- dotenv for environment variables  

## Directory Structure

The project is organized as follows:

```bash
		Mini-QA-App/
		│
		├── backend/
		│ ├── server.js
		│ ├── package.json
		│ ├── .env
		│ ├── config/
		│ │ └── db.js
		│ ├── controllers/
		│ │ ├── authController.js
		│ │ ├── questionController.js
		│ │ └── answerController.js
		│ ├── middleware/
		│ │ └── authMiddleware.js
		│ ├── models/
		│ │ ├── User.js
		│ │ ├── Question.js
		│ │ └── Answer.js
		│ ├── routes/
		│ │ ├── authRoutes.js
		│ │ ├── questionRoutes.js
		│ │ └── answerRoutes.js
		│ └── utils/
		│ └── token.js
		│
		├── frontend/
		│ ├── package.json
		│ ├── public/
		│ │ └── index.html
		│ └── src/
		│ ├── App.js
		│ ├── index.js
		│ ├── api/
		│ │ └── axiosConfig.js
		│ ├── components/
		│ │ ├── Navbar.jsx
		│ │ ├── QuestionCard.jsx
		│ │ └── InsightChart.jsx
		│ ├── pages/
		│ │ ├── Login.jsx
		│ │ ├── Register.jsx
		│ │ ├── Dashboard.jsx
		│ │ ├── AskQuestion.jsx
		│ │ └── AnswerPage.jsx
		│ └── styles/
		│ ├── Login.css
		│ ├── Dashboard.css
		│ └── index.css
		│
		└── README.md
