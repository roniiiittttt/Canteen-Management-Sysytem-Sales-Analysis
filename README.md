# Canteen Management System & Sales Analysis

A comprehensive MERN-stack (MongoDB, Express, React, Node.js) web application designed to manage canteen operations, streamline user ordering, and provide deep administrative sales analytics.

## ? Key Features

### For Users
*   **Intuitive Menu & Cart:** Browse the available menu, add items to the cart, and seamlessly place orders.
*   **Order Tracking:** View order history and monitor the status of active orders.
*   **Booking System:** Schedule and manage dining or pickup bookings.
*   **Payment History:** Track previous transactions and payment methods.

### For Administrators
*   **Sales Analysis Dashboard:** 
    *   **Interactive Visualizations:** Built with `recharts` (Bar, Pie, Area, and Composed charts) for Time, Day, Payment, Customer, Category, and Product analysis.
    *   **Collapsible Accordions:** Neatly organize dense data charts for a clean, scannable user interface.
    *   **KPI Tracking:** Beautifully styled summary cards highlighting Total Orders, Total Revenue, Average Order Value (AOV), and more.
*   **Order & Menu Management:** Update order statuses, add/remove menu items, and manage canteen inventory.
*   **AI Business Analyst (CanteenIQ):** Integrated with OpenAI to provide intelligent insights on sales trends and operations.

---

## ??? Tech Stack

*   **Frontend:** React (Vite), React Router, Recharts, CSS Modules/Styled-components
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB, Mongoose
*   **Authentication:** JSON Web Tokens (JWT)
*   **AI Integration:** OpenAI API

---

## ?? Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16 or higher recommended)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/roniiiittttt/Canteen-Management-Sysytem-Sales-Analysis.git
cd Canteen-Management-Sysytem-Sales-Analysis
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```
Start the backend server:
```bash
npm start
```
*(The backend runs on `http://localhost:5000` by default)*

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```
*(The frontend runs on `http://localhost:5173` by default)*

---

## ?? Generating Mock Data (Optional)

To test the highly-detailed Sales Analysis dashboard, you need data. A data seeding script is included to quickly populate the database with realistic menus, users, and hundreds of orders spread across the last 90 days.

Make sure your MongoDB is running and `MONGO_URI` is correctly set in `backend/.env`.

```bash
cd backend
node seedData.js
```
*Note: This script will clear existing Menus, Users, and Orders before inserting new ones. Do not run this in a production environment.*
