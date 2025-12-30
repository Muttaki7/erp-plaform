# 🏢 ERP Platform (Full-Stack)
A **Full-Stack Enterprise Resource Planning (ERP) System** built with **React.js**, **Node.js**, **MongoDB**, and **JWT-based Authentication**.
This project covers core enterprise modules such as **Authentication, Finance, Inventory, HRM, Procurement, and Sales**, designed with a **scalable architecture**.

---

## 🚀 Tech Stack

### Frontend

* ⚛️ React.js (Vite)
* 🟦 TypeScript
* 🧭 React Router DOM
* 🎨 shadcn/ui + Tailwind CSS
* 🔐 Context API for Auth State
* 📊 Recharts (Dashboards)

### Backend

* 🟢 Node.js (ES Modules)
* 🚀 Express.js
* 🍃 MongoDB + Mongoose
* 🔐 JWT Authentication
* 🔒 Role-Based Access Control (RBAC)
* 📦 REST APIs

### DevOps & Tools

* 🐳 Docker
* 🔁 Git & GitHub
* 🧪 Postman
* 🖥️ VS Code

---

## 🧩 Core Features (1–6)

### 1️⃣ Authentication & Authorization

* User login & logout
* JWT token-based authentication
* Role-based route protection
* Protected frontend routes

### 2️⃣ Finance & Accounting

* General Ledger
* Transactions
* Budget records
* Financial dashboards

### 3️⃣ Inventory Management

* Item & stock tracking
* Warehouse support
* Low-stock alerts
* Inventory dashboard

### 4️⃣ Human Resource Management (HRM)

* Employee records
* Leave management
* Payroll structure
* Role assignment

### 5️⃣ Procurement & Vendor Management

* Vendors
* Purchase orders
* Invoices
* Supplier management

### 6️⃣ Sales & CRM

* Customer records
* Leads & interactions
* Sales tracking

---

## 🏗️ Project Structure

```
erp-platform/
│
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Finance.tsx
│   │   │   ├── Inventory.tsx
│   │   │   └── Unauthorized.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── backend/
│   ├── models/
│   │   ├── user.js
│   │   ├── leave.js
│   │   ├── employee.js
│   │   ├── inventory.js
│   │   └── finance.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── hr.routes.js
│   │   ├── finance.routes.js
│   │   └── inventory.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── server.js
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🔐 Authentication Flow

1. User logs in via React UI
2. Backend validates credentials
3. JWT token generated
4. Token stored in browser
5. Protected routes validate token
6. Role-based access enforced

---

## ⚙️ Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/erp
JWT_SECRET=supersecretkey
```

---

## ▶️ How to Run Locally

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/erp-platform.git
cd erp-platform
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🐳 Run with Docker (Optional)

```bash
docker-compose up --build
```

---

## 🧪 API Testing

Use **Postman** to test:

* `/api/auth/login`
* `/api/hr/leaves`
* `/api/inventory/items`
* `/api/finance/transactions`

---

## 🔒 Security Features

* JWT verification middleware
* Role-based permissions
* Protected API endpoints
* Secure password hashing

---

## 📌 Future Enhancements

* AI Copilot (LLM-based ERP assistant)
* Multi-tenant support
* Advanced reporting
* GraphQL Gateway
* Kubernetes deployment

---

## 🤝 Contribution

Contributions are welcome!

```bash
git checkout -b feature-name
git commit -m "Add new feature"
git push origin feature-name
```

---

## 📄 License

MIT License © 2025

---

## 👤 Author

**Md. Tasnim Muttaki**
🔗 GitHub: [https://github.com/yourusername](https://github.com/yourusername)

Just tell me 👍
