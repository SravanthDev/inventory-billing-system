# Inventory & Billing System - MEAN Stack

A complete Inventory & Billing Management System built with MEAN stack (MongoDB, Express.js, Angular, Node.js). This system provides comprehensive features for managing products, inventory, billing, customers, and generating sales reports.

## 🚀 Features

### Core Features

- **User Authentication & Roles**
  - JWT-based authentication
  - Role-based access control (Admin & Staff)
  - Secure password hashing with bcrypt

- **Product Management**
  - Add, edit, delete products
  - Product fields: name, category, stock, price, description
  - Auto-generated product IDs
  - Product image support
  - Category management

- **Inventory Management**
  - Real-time stock tracking
  - Low stock alerts
  - Stock history
  - Automatic stock updates on sales
  - Filter by category and availability

- **Billing / Sales**
  - Create bills by selecting products
  - Quantity management
  - Tax and discount calculations
  - Auto-calculate subtotal, tax, and total
  - Printable invoice format
  - Multiple payment methods (Cash, Card, UPI, Other)
  - All bills saved to MongoDB

- **Reports & Dashboard**
  - Daily/monthly sales statistics
  - Top-selling products chart
  - Total revenue tracking
  - Inventory value calculation
  - Sales trends visualization
  - CSV export functionality

- **Customer Management**
  - Store customer details with contact info
  - Customer purchase history
  - Total purchases and spending tracking
  - Customer search functionality

### UI/UX Features

- Modern Angular Material design
- Responsive layout with navbar and sidebar
- Toast notifications for success/error alerts
- Intuitive user interface
- Professional charts and visualizations

## 📁 Project Structure

```
MEAN-STACK/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Bill.js
│   │   └── Customer.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── billRoutes.js
│   │   ├── customerRoutes.js
│   │   └── dashboardRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── billController.js
│   │   ├── customerController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── navbar/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── product-form/
│   │   │   │   ├── customer-form/
│   │   │   │   ├── billing/
│   │   │   │   └── bill-detail/
│   │   │   ├── pages/
│   │   │   │   ├── login/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── products/
│   │   │   │   ├── inventory/
│   │   │   │   ├── bills-list/
│   │   │   │   ├── customers/
│   │   │   │   └── reports/
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   └── interceptors/
│   │   └── environments/
│   ├── package.json
│   └── angular.json
│
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Angular CLI (v16 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/inventory_billing
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

4. **Make sure MongoDB is running:**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Seed sample data (optional but recommended):**
   ```bash
   npm run seed
   ```
   
   This creates:
   - Admin user: username `admin`, password `admin123`
   - Staff user: username `staff`, password `staff123`
   - Sample products, customers, and bills

6. **Start the backend server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Or production mode
   npm start
   ```
   
   Backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update API URL (if needed):**
   
   Edit `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000/api'
   };
   ```

4. **Start the Angular development server:**
   ```bash
   ng serve
   # or
   npm start
   ```
   
   Frontend will run on `http://localhost:4200`

5. **Build for production:**
   ```bash
   ng build --configuration production
   ```

### Running Both Servers Concurrently

You can use tools like `concurrently` or run them in separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
ng serve
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (Admin only)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/low-stock` - Get low stock products

### Bills
- `GET /api/bills` - Get all bills
- `GET /api/bills/:id` - Get single bill
- `POST /api/bills` - Create bill
- `DELETE /api/bills/:id` - Delete bill (Admin only)
- `GET /api/bills/stats` - Get sales statistics

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/:id/history` - Get customer purchase history

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## 🔐 Default Login Credentials

After seeding data:

- **Admin:**
  - Username: `admin`
  - Password: `admin123`

- **Staff:**
  - Username: `staff`
  - Password: `staff123`

## 🎯 Usage Guide

### For Admins:
1. Login with admin credentials
2. Access Products page to add/edit/delete products
3. View Reports page for sales analytics
4. Manage all bills and customers

### For Staff:
1. Login with staff credentials
2. Access Inventory to view products
3. Create bills through Billing page
4. View and manage customers
5. Access dashboard for overview

## 🛡️ Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based route protection
- Input validation using express-validator
- CORS configuration
- Environment variables for sensitive data

## 📊 Technologies Used

### Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- CORS

### Frontend:
- Angular 16
- Angular Material
- RxJS
- Chart.js (via ng2-charts)
- TypeScript

## 🚧 Future Enhancements

- [ ] PDF invoice generation
- [ ] Dark mode toggle
- [ ] Advanced search and filtering
- [ ] Email notifications for low stock
- [ ] Barcode scanning for products
- [ ] Multi-warehouse support
- [ ] Supplier management
- [ ] Purchase orders

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ using MEAN Stack**

