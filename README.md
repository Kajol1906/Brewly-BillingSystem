# ☕ Brewly — Full-Stack POS & Billing System

**Brewly** is a high-performance, modern POS (Point of Sale) and Billing system designed for cafés and restaurants. It features real-time dashboard analytics, inventory management with recipe auto-deduction, calendar-based event booking, and a **Spring AI-powered Virtual Assistant**.

![Dashboard Preview](file:///C:/Users/Kajol/.gemini/antigravity/brain/e0192ba7-c386-404a-abe1-38f19dbd78f2/media__1778790114162.png)

---

## 🚀 Key Features

### 🛒 Point of Sale (POS) & Billing
- **Interactive Menu**: Quick-add items to cart with category filtering.
- **Table Management**: Real-time status tracking (Available, Occupied, Reserved).
- **Flexible Payments**: Support for Cash and UPI payments with instant bill generation.

### 🧠 Smart AI Assistant (New!)
- **Natural Language Queries**: Ask questions about your business data like *"What is my revenue today?"* or *"How many tables are occupied?"*.
- **Integrated Knowledge**: The AI understands every screen and field in the app to provide instant support.
- **Powered by Spring AI**: Uses LLM Function Calling to securely bridge your database with AI intelligence.

### 📊 Business Intelligence & Analytics
- **6 AI-Powered Modules**: Revenue forecasting, peak hour traffic analysis, category performance, product recommendations, stock depletion prediction, and payment insights.
- **Visual Dashboards**: Real-time charts for daily sales trends and top-selling items.

### 📦 Inventory & Recipe Management
- **Recipe Linking**: Automatically deducts ingredients from stock when a menu item is sold.
- **Low Stock Alerts**: Visual warnings when ingredients hit their minimum threshold.
- **Excel Export**: Export your menu and inventory data for offline reporting.

### 📅 Event & Table Booking
- **Calendar View**: Schedule and manage birthdays, corporate events, and large gatherings.
- **Integrated Reservations**: Automatically blocks tables for booked events.

### 🔐 Security & Auth
- **Dual Authentication**: Secure login via JWT-based stateless auth or **Google OAuth 2.0**.
- **Data Isolation**: Multi-tenant architecture ensuring each owner only sees their own data.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** (Vite + SWC)
- **TypeScript**
- **Tailwind CSS 4** & **Framer Motion**
- **shadcn/ui** & **Radix UI**
- **Recharts** (Data Visualization)
- **Axios** & **React Hook Form**

### Backend
- **Java 17** & **Spring Boot 3.4**
- **Spring AI** (Generative AI Integration)
- **Spring Data JPA** & **Hibernate**
- **Spring Security** (JWT + OAuth 2.0)
- **Spring Boot Starter Mail** (SMTP)
- **PostgreSQL** (Database)

---

## 📐 Architecture
- **Layered Backend**: Controller → Service → Repository pattern for clean separation of concerns.
- **RESTful API**: Stateless communication with JWT token exchange.
- **Responsive SPA**: Mobile-first design for tablets and desktops.

---

## 📱 Application Screens
1. **Landing Page**: Modern marketing page with smooth scroll animations.
2. **Dashboard**: Central hub for business metrics and trends.
3. **POS Screen**: Fast-paced order taking interface.
4. **Inventory Table**: Deep-dive into stock levels and thresholds.
5. **Menu Management**: Categorized menu CRUD and Excel export.
6. **AI Insights**: Advanced analytics for business growth.
7. **Event Calendar**: Monthly view for event planning.
8. **AI Assistant**: Floating widget for natural language support.

---

## 🏁 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+

### Setup
1. **Clone the repository**.
2. **Database**: Create a database named `brewly_db`.
3. **Backend**:
   - Update `brewly-backend/src/main/resources/application.properties` with your PostgreSQL credentials.
   - Run: `cd brewly-backend && ./mvnw spring-boot:run`
4. **Frontend**:
   - Run: `cd brewly-frontend && npm install && npm run dev`
5. **Access**: Open `http://localhost:3000` (or `3001`).

---
*Created with ❤️ for modern café management.*
