# Brewly Billing System

A modern, full-stack POS and Billing System designed for cafes and restaurants. Brewly streamlines operations from order taking to billing, inventory management, event booking, and AI-powered business insights.

---

## Key Features

### Authentication
- Secure user registration and login with JWT-based authentication.
- Google OAuth 2.0 integration for one-click sign-in.

### Landing Page
- Professional landing page with hero section, feature highlights, use cases, and contact information.
- Smooth scroll animations powered by Framer Motion.

### Dashboard and Analytics
- Real-time metric cards for Today's Revenue, Total Orders, Occupied Tables, and Low Stock items.
- Daily Sales trend charts and Top Selling Items visualizations using Recharts.

### Point of Sale (POS)
- Interactive menu grid categorized by item type (Coffee, Snacks, etc.).
- Cart management with add/remove items and quantity adjustments.
- Order workflow: Place Order, then Generate Bill.
- Billing supports Cash and UPI payment methods with automatic table clearing.

### Table Management
- Real-time table status display: Available (Green), Occupied (Red), Reserved (Orange).
- Dynamic updates upon billing or event booking.

### Menu and Inventory Management
- Full menu item management with categorization.
- Ingredient-level inventory tracking with stock levels and units.
- Recipe linking: automatic ingredient deduction when menu items are sold.
- Low stock alerts with visual warnings when stock dips below defined thresholds.

### Event and Vendor Management
- Calendar-based event booking for Birthdays, Corporate events, and more.
- Vendor management for Photographers, DJs, and Decorators.
- Direct vendor assignment to events during the booking process.
- Table reservation integration with event scheduling.

### AI Insights
- Peak Hour Forecasting for staffing and preparation planning.
- Smart Product Recommendations based on sales patterns.
- Stock Depletion predictions and Category Performance analysis.

### Settings
- Customizable application settings and user preferences.

---

## Technology Stack

| Layer      | Technologies                                                  |
|------------|---------------------------------------------------------------|
| Frontend   | React, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend    | Java 17, Spring Boot 3, Spring Data JPA, Hibernate            |
| Database   | PostgreSQL                                                    |
| Build      | Maven (Backend), npm (Frontend)                               |

---

## Project Structure

```
Brewly-BillingSystem/
├── brewly-backend/          # Spring Boot backend
│   ├── src/main/java/       # Java source code
│   ├── src/main/resources/  # Configuration files
│   ├── .env.properties      # Secrets (gitignored)
│   ├── pom.xml              # Maven dependencies
│   └── mvnw.cmd             # Maven wrapper
├── brewly-frontend/         # React frontend
│   ├── src/components/      # UI components
│   ├── src/services/        # API service layer
│   ├── src/context/         # React context providers
│   ├── src/styles/          # Global styles
│   ├── package.json         # npm dependencies
│   └── vite.config.ts       # Vite configuration
├── .gitignore
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL (running on port 5432)

### 1. Database Setup
Create a PostgreSQL database named `brewly_db`. The application will automatically create tables and seed initial data on the first run.

### 2. Backend Configuration
Navigate to the backend directory and create a `.env.properties` file in the project root (`brewly-backend/.env.properties`) with the following variables:

```properties
# Google OAuth Credentials
google.client.id=YOUR_GOOGLE_CLIENT_ID
google.client.secret=YOUR_GOOGLE_CLIENT_SECRET

# Contact form recipient
contact.recipient.email=YOUR_EMAIL

# Spring Mail SMTP settings
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL
spring.mail.password=YOUR_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Database
DB_PASSWORD=YOUR_DB_PASSWORD
```

### 3. Start the Backend
```bash
cd brewly-backend
./mvnw spring-boot:run
```
The server will start at `http://localhost:8080`.

### 4. Start the Frontend
```bash
cd brewly-frontend
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## API Endpoints

| Module         | Endpoints                                                    |
|----------------|--------------------------------------------------------------|
| Authentication | `/api/auth/register`, `/api/auth/login`, `/api/auth/google`  |
| Dashboard      | `/api/dashboard/metrics`, `/api/dashboard/sales/daily`, `/api/dashboard/sales/top-items` |
| Tables         | `/api/tables`                                                |
| POS / Billing  | `/api/billing/generate`                                      |
| Menu           | `/api/menu`                                                  |
| Inventory      | `/api/inventory`                                             |
| Events         | `/api/events`                                                |
| Vendors        | `/api/vendors`                                               |
| AI Insights    | `/api/ai/peak-hours`, `/api/ai/recommendations`             |
| Contact        | `/api/contact`                                               |

---

## License
This project is open-source and available under the MIT License.
