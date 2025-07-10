# CRM Application Setup

## Quick Setup Instructions

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Start MongoDB
Make sure MongoDB is running on your system. If not installed:
- Download from: https://www.mongodb.com/try/download/community
- Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo`

### 4. Start Backend Server
```bash
cd backend
npm run dev
```
Server will start on http://localhost:5000

### 5. Start Frontend
```bash
npm run dev
```
Frontend will start on http://localhost:5173

### 6. Create First User
Visit http://localhost:5173/signup to create your first account.

## API Endpoints Available

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Leads Management
- GET /api/leads - Get all leads
- POST /api/leads - Create new lead
- PUT /api/leads/:id - Update lead
- DELETE /api/leads/:id - Delete lead

## Features Connected
✅ User Authentication (Login/Register)
✅ Protected Routes
✅ Lead Management
✅ API Integration
✅ JWT Token Management
✅ Error Handling

## Next Steps
1. Test login/register functionality
2. Add more lead management features
3. Implement real-time updates
4. Add file upload capabilities 