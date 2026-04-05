# Finance Dashboard Backend

This project is a backend API for a Finance Dashboard system.  
It allows users to manage financial records and view dashboard analytics such as totals, trends, and recent records.

The system uses authentication and role-based authorization to control access to different features.

---

#  Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Role-Based Authorization
- MongoDB Aggregation

---

# Project Structure

backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── dashboardController.js
│   ├── recordController.js
│   └── userController.js
│
├── middlewares/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── models/
│   ├── FinancialRecord.js
│   └── User.js
│
├── routes/
│   ├── dashboardRoutes.js
│   ├── FinancialRoutes.js
│   └── UserRoutes.js
│
├── utils/
├── .env
├── server.js
└── package.json

--- 

## 🔑 Environment Variables (.env)

Create a `.env` file in the root of the backend folder and add the following variables:

```env
PORT=4000

MONGO_URI=MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/finance_dashboard

JWT_SECRET=financeDashboardSecretKey998

# ⚙️ Setup Process 
cd backend 
npm install 
npm run dev

## 1️⃣ Clone Repository

```bash
git clone "https://github.com/Ramanjich/Financial-system.git"
