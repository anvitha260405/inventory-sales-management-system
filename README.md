# Inventory and Sales Management System with Inventory Analytics

## Project Overview
This project is a **full-stack Inventory and Sales Management System** designed to help small and medium-scale businesses manage inventory efficiently.

Many businesses struggle with manual inventory tracking, disconnected sales systems, and lack of visibility into stock levels. This system integrates product management, sales transactions, automatic stock updates, and inventory-focused analytics into a single platform.

The goal of the system is to provide better visibility into inventory health and help businesses make informed restocking decisions.

The system helps businesses avoid:
- Stock shortages
- Excess inventory
- Dead stock
- Poor inventory visibility

---

# Problem Statement
Many small and medium-scale businesses face difficulties managing inventory due to manual tracking or disconnected systems between sales and stock management.

This often leads to:
- Stock shortages
- Overstocking
- Dead inventory
- Poor tracking of inventory movement

This project solves these problems by providing an integrated **Inventory and Sales Management System with Inventory Analytics**. The system automatically updates stock after each sale and provides insights such as low-stock detection, dead stock identification, stock movement tracking, and inventory turnover analysis.

These insights help businesses optimize inventory levels and improve operational efficiency.

---

# Technologies Used

## Backend
- Java
- Spring Boot
- Spring Data JPA
- REST APIs
- H2 Database (file-based)

## Frontend
- React
- Vite
- Bootstrap
- Axios

## Tools
- IntelliJ IDEA
- Postman
- Git
- GitHub

---

# Features

## Product Management
- Add new products
- Edit product information
- Delete products
- Search products by name
- Manage stock levels
- Set reorder levels

## Sales Management
- Record sales transactions
- Multiple items per sale
- Automatic stock deduction after each sale

## Inventory Analytics
- Low stock detection
- Dead stock identification
- Stock movement tracking
- Inventory turnover analysis

## Dashboard
The dashboard provides an overview of the inventory system including:
- Total number of products
- Low stock products
- Dead stock products
- Stock movement summary
- Inventory turnover indicator

---

# System Workflow

Start

↓

User accesses dashboard

↓

Add / Update Products

↓

Set Stock Levels and Reorder Levels

↓

Record Sales Transaction

↓

Automatic Stock Update

↓

Inventory Analysis

- Low Stock Detection
- Dead Stock Identification
- Stock Movement Tracking
- Inventory Turnover Analysis

↓

Generate Inventory Insights

↓

End

---

# System Architecture

Frontend (React + Vite)

↓

REST API Layer (Spring Boot)

↓

Business Logic (Services)

↓

Database Layer (Spring Data JPA)

↓

H2 File-Based Database

---

# Screens / Application Pages

The application includes the following main pages:

- Dashboard
- Products Management
- Sales Transactions
- Inventory Analytics

---

# How to Run the Project

## Run Backend (Spring Boot)

1. Open the project in **IntelliJ IDEA**
2. Locate the main class:InventorysystemApplication.java

3. Click **Run**

Backend will start on:
[http---localhost-8080.url](../../AppData/Local/Temp/http---localhost-8080.url)
---

## Run Frontend (React)

Open terminal and navigate to frontend folder:


cd inventory-frontend


Install dependencies (first time only):


npm install


Start the frontend server:


npm run dev


Frontend will run on:


http://localhost:5173


---

# API Endpoints (Examples)


GET /api/products
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}

GET /api/analytics/low-stock
GET /api/analytics/dead-stock
GET /api/analytics/stock-movements
GET /api/analytics/turnover


---

# Future Improvements
- User authentication system
- Advanced inventory reports
- Data visualization charts
- Export reports (PDF/Excel)

---

# Author

**Anvitha Chandupatla**