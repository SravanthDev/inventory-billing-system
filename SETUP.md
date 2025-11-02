# Quick Setup Guide

This guide will help you get the Inventory & Billing System up and running quickly.

## Prerequisites Checklist

- [ ] Node.js (v16+) installed
- [ ] MongoDB installed and running (or MongoDB Atlas account)
- [ ] Angular CLI installed globally (`npm install -g @angular/cli`)

## Step-by-Step Setup

### 1. Clone/Download the Project

```bash
cd MEAN-STACK
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your MongoDB connection string
# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/inventory_billing

# Seed sample data (creates admin, staff, products, customers)
npm run seed

# Start backend server
npm run dev
```

Backend should now be running on `http://localhost:3000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Angular dev server
ng serve
# or
npm start
```

Frontend should now be running on `http://localhost:4200`

### 4. Access the Application

1. Open browser: `http://localhost:4200`
2. Login with:
   - **Admin**: username `admin`, password `admin123`
   - **Staff**: username `staff`, password `staff123`

## Troubleshooting

### MongoDB Connection Issues

If you're having trouble connecting to MongoDB:

**Local MongoDB:**
```bash
# Make sure MongoDB is running
mongod
```

**MongoDB Atlas:**
1. Get connection string from Atlas dashboard
2. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_billing
   ```

### Port Already in Use

If port 3000 or 4200 is already in use:

**Backend:**
```bash
# Edit backend/.env
PORT=3001  # or any available port
```

**Frontend:**
```bash
# Update frontend/src/environments/environment.ts
apiUrl: 'http://localhost:3001/api'  # Match backend port
```

Or run Angular on different port:
```bash
ng serve --port 4201
```

### CORS Errors

If you see CORS errors:
- Make sure backend is running
- Check API URL in `frontend/src/environments/environment.ts`
- Verify CORS is enabled in `backend/server.js`

### Angular CLI Not Found

```bash
npm install -g @angular/cli
```

## Common Commands

### Backend
```bash
npm start          # Production mode
npm run dev        # Development mode (with nodemon)
npm run seed       # Seed sample data
```

### Frontend
```bash
ng serve           # Development server
ng build           # Production build
ng test            # Run tests
```

## Next Steps

1. Explore the Dashboard
2. Add your first product (Admin only)
3. Create a bill from the Billing page
4. Check Inventory for stock levels
5. View Reports for sales analytics

## Support

For issues or questions, check the main README.md file.

---

**Happy Coding! 🚀**

