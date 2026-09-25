# SMARTWEALTH
### Smart Expense Tracker & Personal Wealth Management System
> **"Track. Analyze. Plan. Grow."**

A full-stack, production-quality fintech web application built with **React.js, Vite, Tailwind CSS, Recharts, Lucide Icons, Node.js, Express.js, and MongoDB**. Designed as an enterprise-grade personal wealth and expense management system suitable for final-year college capstones and portfolio showcases.

---

## 🌟 Key Features

1. **Modern Design System**
   - Deep Navy (`#0F172A`), Emerald (`#10B981`), and Teal (`#0D9488`) color palette.
   - Clean card-based layout with soft shadows and micro-interactions.
   - Responsive sidebar navigation (collapsible for tablet/mobile).
   - Light and Dark mode preference support.

2. **Public Landing Page**
   - Modern hero section with call-to-actions ("Get Started Free", "Try Interactive Demo").
   - Feature showcase: Expense Tracking, Smart Budgeting, Savings Goals, Financial Analytics, AI-Powered Insights, and Fair Expense Splitter.
   - 3-step workflow walkthrough and interactive mockups.

3. **Authentication & Security**
   - JSON Web Token (JWT) stateless authentication stored securely.
   - Password encryption using `bcryptjs` with salt rounds.
   - Protected client routes with React Router v6 guards.
   - User profile customization (Name, Currency preference `₹ INR`, `$ USD`, `€ EUR`, `£ GBP`).

4. **Main Financial Dashboard**
   - Dynamic greeting & current date.
   - 4 KPI stat cards: Total Balance, Monthly Income, Monthly Expenses, Savings Rate with trend badges.
   - Section A: Cash Flow & Expense Overview (Interactive 6-Month Recharts Area Chart).
   - Section B: Spending by Category (Recharts Donut Chart with live legend).
   - Section C: Recent Transactions feed.
   - Section D: Category Budget progress meters.
   - Section E: Active Savings Goals tracker.
   - Section F: Smart AI Financial Insight banner.

5. **Dedicated Expense Tracker**
   - Full CRUD: Add, Edit, Delete expenses with confirmation modals.
   - Categorization: Food, Shopping, Transport, Bills, Entertainment, Education, Health, Other.
   - Payment Methods: UPI, Cash, Debit Card, Credit Card, Bank Transfer.
   - Instant search and multi-criteria filters (by Category, Payment Method, Date, Sort by Amount/Date).
   - Live total calculation of filtered expenditures.

6. **Income Streams Manager**
   - Full CRUD: Track Salary, Freelance retainers, Business revenues, Scholarships, and Other inflows.
   - Source breakdowns and net inflow tracking.

7. **Category Budget Management**
   - Set monthly spending ceilings per category.
   - Automated consumption calculation against real expenses in that month.
   - Color-coded progress indicators: **Safe (< 75%)**, **Near Limit (75% - 100%)**, **Over Budget (> 100%)**.
   - Proactive alert banners when spending approaches limits.

8. **Savings Goals**
   - Set target amounts, current saved funds, target dates, and categories (Gadget, Vehicle, Travel, Emergency, Home, Education).
   - Dynamic days-remaining countdown and percentage completion rings.
   - "Add Money to Goal" quick deposit modal.

9. **Expense Splitter (Fair Debt Settlement)**
   - Create groups (e.g., "Goa Weekend Trip", "Apartment 402").
   - Add group expenses with payer and participant selections.
   - **Greedy Debt Minimization Algorithm**: Automatically simplifies multi-party debts and outputs exact settlement actions (e.g. *"Rahul should receive ₹500"*, *"Krishna owes ₹250 to Rahul"*).
   - Interactive settlement checkboxes ("Mark Settled").

10. **Financial Planning & Wealth Simulator**
    - Dynamic input simulator: Monthly income, expenses, and goal targets.
    - Real-time calculations: Monthly savings capacity, savings percentage, expense-to-income ratio, estimated months to reach goal.
    - Feasibility checks and monthly target recommendations.
    - 50/30/20 standard financial rule comparison (50% Needs, 30% Wants, 20% Savings).
    - Future wealth projection curve (Recharts Area/Line).

11. **Comprehensive Financial Analytics**
    - Multi-period filtering: **This Week**, **This Month**, **Last 3 Months**, **This Year**.
    - 4 distinct charts: Line Chart (Cash Flow Timeline), Donut Chart (Category Share), Bar Chart (Net Inflow/Outflow Comparison), Area Chart (Cumulative Savings Velocity).
    - Average daily burn rate and projected 30-day monthly run rate.

12. **AI-Powered Financial Insights**
    - Autonomous rule-based intelligence engine running 100% locally without requiring paid API keys.
    - Analyzes month-over-month category surges (+18% Food spending alert).
    - Savings rate health audits benchmarked against financial guidelines.
    - Discretionary cut suggestions (e.g., "Reducing shopping by ₹1,000 increases monthly savings by 15%").
    - Budget utilization hazard warnings.

13. **Demo Data Seeder (Indian Context)**
    - Single-click "Seed Demo Indian Data" button in navbar and settings.
    - Immediately seeds realistic Indian financial records (Salary ₹35,000, Freelance ₹5,000, Food ₹3,500, Transport ₹1,500, Shopping ₹4,000, Goa roadtrip group split, MacBook Pro goal) so the entire platform is populated instantly for presentations.

---

## 📁 Project Structure

```
smart expenses/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── ConfirmModal.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── SkeletonLoader.jsx
│   │   │   │   └── StatCard.jsx
│   │   │   └── layout/
│   │   │       ├── DashboardLayout.jsx
│   │   │       ├── Navbar.jsx
│   │   │       └── Sidebar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── BudgetsPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ExpensesPage.jsx
│   │   │   ├── GoalsPage.jsx
│   │   │   ├── IncomePage.jsx
│   │   │   ├── InsightsPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── PlanningPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── SplitterPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   ├── currency.js
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── budgetController.js
│   │   ├── dashboardController.js
│   │   ├── expenseController.js
│   │   ├── goalController.js
│   │   ├── incomeController.js
│   │   ├── insightController.js
│   │   ├── seedController.js
│   │   └── splitController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Budget.js
│   │   ├── Expense.js
│   │   ├── ExpenseGroup.js
│   │   ├── Income.js
│   │   ├── SavingsGoal.js
│   │   └── User.js
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── incomeRoutes.js
│   │   ├── insightRoutes.js
│   │   ├── seedRoutes.js
│   │   └── splitRoutes.js
│   ├── utils/
│   │   ├── debtSimplifier.js
│   │   └── insightEngine.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ Prerequisites & Installation

### 1. Requirements
- **Node.js**: v18.0.0 or later (LTS recommended)
- **MongoDB**: Local MongoDB Community Server (`mongodb://127.0.0.1:27017`) or free cloud MongoDB Atlas cluster.

### 2. Installation
Open your terminal in the project root directory:

```bash
# Install root, backend, and frontend packages
cd server
npm install

cd ../client
npm install
```

---

## ⚙️ Environment Configuration

### Backend (`server/.env`)
Create or edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartwealth
JWT_SECRET=smartwealth_super_secure_jwt_secret_key_2026_finance
NODE_ENV=development
```

> **Note**: If using MongoDB Atlas in the cloud, replace `MONGO_URI` with your connection string:
> `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/smartwealth?retryWrites=true&w=majority`

### Frontend (`client/.env`)
Create or edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application

### Start Backend API Server:
```bash
cd server
npm run dev
```
*Server will start on `http://localhost:5000` and connect to MongoDB.*

### Start Frontend Dev Server:
In a second terminal window:
```bash
cd client
npm run dev
```
*Vite will start the client on `http://localhost:5173`.*

Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 🧪 Testing & Demo Walkthrough

1. **Visit Landing Page**:
   - Open `http://localhost:5173`.
   - Inspect Hero, Why SmartWealth, Features grid, How It Works, and interactive mockups.

2. **Sign In / Registration**:
   - Click **"Get Started Free"** to create a custom account, OR
   - Click **"One-Click Demo Login"** on the Login page for instant evaluator access (`demo@smartwealth.io` / `password123`).

3. **Populate Demo Indian Financial Data**:
   - On the top Navbar or in Settings, click **"Demo Data"** (or **"Seed Sample Indian Data"**).
   - Instantly populates:
     - Incomes: Salary ₹35,000, Freelance ₹5,000
     - Expenses: Food ₹3,500, Shopping ₹4,000, Transport ₹1,500, Bills ₹2,500, Education ₹2,000, Entertainment ₹1,200
     - Budgets: Food, Shopping, Bills, Transport with safe/near/over meters
     - Goals: MacBook Pro M3 (Target ₹60,000, Saved ₹35,000)
     - Splitter: "Goa Weekend Roadtrip" with Rahul, Krishna, Priya, and Vivek.

4. **Test Expense Tracker**:
   - Go to `/expenses`.
   - Add an expense: `Food`, `₹450`, `UPI`, `Team snacks`.
   - Filter by category, search by keyword, and edit/delete.

5. **Test Expense Splitter**:
   - Go to `/splitter`.
   - View the fair settlement cards ("Rahul should receive ₹500", "Krishna owes ₹250").
   - Click "Mark Settled" to toggle payment statuses.

6. **Test Financial Planning & Simulator**:
   - Go to `/planning`.
   - Adjust monthly income and target amount sliders.
   - Watch real-time calculations of savings margin, months-to-goal, and 50/30/20 guideline breakdown.

7. **Test AI Insights**:
   - Go to `/insights`.
   - View automated audits of spending jumps, savings benchmarks, and discretionary cut recommendations.

---

## 🔧 Common Errors & Fixes

1. **`MongoDB connection refused (ECONNREFUSED 127.0.0.1:27017)`**
   - Cause: MongoDB service is not started on Windows.
   - Fix: Start MongoDB service in PowerShell as Administrator:
     ```powershell
     Start-Service MongoDB
     ```
     Or pass a free MongoDB Atlas connection string in `server/.env`.

2. **`Port 5000 already in use (EADDRINUSE)`**
   - Cause: Another process is listening on port 5000.
   - Fix: Change `PORT=5001` in `server/.env` and update `VITE_API_URL=http://localhost:5001/api` in `client/.env`.

3. **`CORS Error in Browser Console`**
   - Cause: Express server is rejecting the origin or Vite is running on an unexpected port.
   - Fix: Backend CORS is enabled with `cors({ origin: true, credentials: true })`. Ensure `server.js` is running.

---

## 📜 License
MIT License. Built for portfolio showcases, academic evaluations, and personal wealth tracking.
