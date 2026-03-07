# ☕ Brewly Billing System

A modern, full-stack POS and Billing System designed for cafes and restaurants. Brewly streamlines operations from order taking to billing, inventory management, and event booking, powered by AI insights.

## 🚀 Key Features

### 🖥️ Point of Sale (POS)
- **Interactive Menu**: Visual grid of items categorized by type (Coffee, Snacks, etc.).
- **Cart Management**: Add/remove items, adjust quantities.
- **Order Sequencing**: "Place Order" -> Kitchen -> "Generate Bill".
- **Billing**: Supports Cash and UPI payments with auto-table clearing.

### 🪑 Table Management
- **Real-time Status**: View tables as **Available** (Green), **Occupied** (Red), or **Reserved** (Orange).
- **Dynamic Updates**: Status changes automatically upon Billing or Booking.

### 📊 Dashboard & Analytics
- **Live Metrics**: Real-time cards for Today's Revenue, Total Orders, Occupied Tables, and Low Stock.
- **Visual Charts**: Daily Sales trends and Top Selling Items.
- **AI Insights**: Peak Hour Forecasts and Smart Product Recommendations.

### 📦 Inventory & Menu
- **Ingredient Tracking**: diverse inventory management with stock levels.
- **Recipe Linking**: Automatically deducts ingredients when menu items are sold.
- **Low Stock Alerts**: Visual warnings when stock dips below thresholds.

### 🎉 Event & Vendor Management
- **Event Booking**: Calendar-based booking for Birthdays, Corporate events, etc.
- **Vendor System**: Manage Photographers, DJs, and Decorators.
- **Integration**: Assign Vendors directly to Events during booking.

---

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript (Vite), Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Java 17 (Spring Boot 3), Spring Data JPA, Hibernate.
- **Database**: PostgreSQL.
- **Building**: Maven (Backend), npm (Frontend).

---

## ⚙️ Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL (Running on port 5432)

### 1. Database Setup
Create a PostgreSQL database named `brewly_db`. The application will automatically create tables and seed initial data on the first run.

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd brewly-backend
```
Run the application:
```bash
./mvnw spring-boot:run
```
The server will start at `http://localhost:8080`.

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🧪 API Endpoints

- **Dashboard**: `/api/dashboard/metrics`, `/api/dashboard/sales/daily`, `/api/dashboard/sales/top-items`
- **Tables**: `/api/tables`
- **Billing**: `/api/billing/generate`
- **Menu/Inventory**: `/api/menu`, `/api/inventory`
- **Events**: `/api/events`
- **Vendors**: `/api/vendors`
- **AI**: `/api/ai/peak-hours`, `/api/ai/recommendations`

---

## 📄 License
This project is open-source and available under the MIT License.
