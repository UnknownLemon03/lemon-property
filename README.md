---

# 🏡 Property Listing System

A full-stack property listing platform built for an SDE Intern Backend Assignment. The system supports user authentication, property CRUD operations, advanced filtering, favoriting, and property recommendations.

---

## 🌐 Live Demo

* **Deployed App:** \ [Link](https://lemon-property-frontend.vercel.app/)
* **Backend Api (Open API):** \ [Link](https://lemon-property.onrender.com/)


---

## 🛠 Tech Stack

### Frontend

* **Next.js**
* **TypeScript**
* **Tailwind CSS**

### Backend

* **Node.js**
* **Express**
* **TypeScript**
* **MongoDB**
* **Redis** (for caching)
* **Swagger** (for API documentation)

---

## ✨ Features

### 🔐 Authentication

* User registration and login using email/password
* JWT-based authentication for secure access

### 🏘️ Property Management

* Full **CRUD operations** on properties
* Only the creator of a property (`createdBy` field) can edit or delete it

### 🔍 Advanced Filtering

* Search and filter properties using multiple attributes:

  * Price, City, State, Type, Bedrooms, Bathrooms, Area, Parking, etc.

### ⭐ Favorites

* Users can **add**, **view**, and **remove** properties from their favorites list

### 🔄 Caching

* Redis is used to cache frequently accessed data to improve performance

### 📢 Property Recommendations

* Users can **recommend a property** to another registered user by email
* Recommended properties appear in the recipient's **"Recommendations Received"** section

---

## 📂 Dataset

* Property listings imported from [CSV Dataset](https://cdn2.gro.care/db424fd9fb74_1748258398689.csv)
* Loaded into MongoDB during initialization

