# FluxStock Inventory Management System

FluxStock is a premium, high-performance inventory control hub designed for modern businesses. It provides real-time visibility into stock levels, procurement financials, and supply chain movements with a sophisticated, glassmorphic user interface.

![FluxStock Dashboard Mockup](public/dashboard_mockup.png) *(Note: Add your own dashboard screenshot here)*

## 🚀 Key Features

### 📦 Advanced Inventory Control
- **Rich Product Metadata**: Support for categories, sub-categories, brands, multiple images, and unit of measure (UoM).
- **Batch & Expiry Tracking**: Monitor sensitive stock with batch numbers and expiration dates.
- **Stock Health Metrics**: Real-time alerts for low-stock items and automatic inventory valuation.

### 💳 Financial & Procurement Intelligence
- **Vendor Management**: Comprehensive supplier registry with performance and procurement tracking.
- **Multi-Channel Payments**: Record transactions via Cash, POS, Bank Transfer, Mobile Money, and more.
- **Split Liquidation**: Support for complex payments including part-payments and multiple liquidation methods per transaction.
- **Financial Outflow Tracking**: Monitor total acquisition costs vs. market asset value.

### 🕵️ Audit & Traceability
- **Immutable Ledger**: A permanent record of every stock movement (`IN`, `OUT`, `ADJUST`).
- **User Accountability**: Every action is linked to a specific user with timestamps and reasons for the movement.
- **Serialized Tracking**: Support for individual unit tracking (IMEI/Serial numbers) for high-value items.

### 🎨 Premium User Experience
- **Glassmorphic UI**: High-fidelity, modern interface with smooth transitions and vibrant aesthetics.
- **Responsive Management**: Fully optimized for desktop and mobile procurement flows.
- **Role-Based Access**: Granular permissions for `ADMIN`, `MANAGER`, and `STAFF` roles.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **State Management**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL instance (Supabase, Neon, or local)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/inventory-app.git
   cd inventory-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/fluxstock"
   JWT_SECRET="your-super-secret-key"
   ```

4. **Database Migration**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```


Open [http://localhost:3000](http://localhost:3000) to access the system.

## 📖 How to Use

### 1. Logging In
The system comes with a pre-seeded admin account. Use the following credentials to access the dashboard for the first time:
- **Email**: `admin@example.com`
- **Password**: `adminpassword`

> **Note**: It is highly recommended to change the admin password immediately after logging in from the **System Settings** or **Profile** section.

### 2. Dashboard Overview
Upon logging in, you will be greeted by the **Main Dashboard**. This provides a high-level view of your business:
- **Key Metrics**: View total stock value, low-stock alerts, and recent activity.
- **Quick Actions**: Navigation shortcuts to common tasks.

### 3. Managing Inventory
Navigate to the **Inventory** section in the sidebar to manage your stock:
- **Products**: Add, edit, or delete product listings. You can track rich metadata including brands, categories, and images.
- **Stock Ledger**: View a granular audit trail of every stock movement (IN/OUT). This is crucial for accountability and tracing discrepancies.

### 4. Procurement & Suppliers
Manage your supply chain under the **Purchasing** section:
- **Suppliers**: Maintain a registry of your vendors and view their performance history.
- **Purchases**: Record new stock acquisitions. The system handles complex payment methods including split payments and different liquidation types.

### 5. Finance & Reports
Gain insights into your business performance:
- **Financial Reports**: Analyze your financial outflows (acquisition costs) vs. asset value.
- **Stock Health**: Identify slow-moving or expiring items (if batch tracking is enabled).

### 6. Administration (Admins Only)
Users with `ADMIN` or `MANAGER` roles have access to the **Administration** panel:
- **User Management**: Create and manage accounts for your staff.
  - **Roles**: Assign `STAFF`, `MANAGER`, or `ADMIN` roles to control access levels.
- **System Settings**: Configure global application settings.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ for High-Performance Teams.
