# 🚀 Employee Login Demo Guide

## 📋 **Complete Employee Management & Login Flow**

### **Step 1: Start the Servers**

```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend  
npm run dev
```

### **Step 2: Login as Admin**

1. Go to `http://localhost:5173/login`
2. Login with admin credentials:
   - **Email:** `admin@crm.com`
   - **Password:** `admin123`
3. You'll be redirected to the dashboard

### **Step 3: Add Employee**

1. In the dashboard, click the **"EMPLOYEES"** button (green button)
2. Click **"Add Employee"**
3. Fill in the form:
   - **Name:** `John Employee`
   - **Email:** `john@company.com`
   - **Password:** `password123`
4. Click **"Create Employee"**
5. ✅ Employee created successfully!

### **Step 4: Test Employee Login**

1. Open a new incognito/private browser window
2. Go to `http://localhost:5173/login`
3. Login with employee credentials:
   - **Email:** `john@company.com`
   - **Password:** `password123`
4. ✅ Employee login successful!

### **Step 5: Verify Employee Access**

- Employee will see the dashboard with their name
- They can access all CRM features
- Their role will be "Employee"

## 🔧 **Technical Details**

### **Database Structure**
```sql
-- Users table supports employee role
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user', 'manager', 'employee') DEFAULT 'user',
  avatar VARCHAR(255) DEFAULT '',
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **API Endpoints**
- `POST /api/users/employees` - Create employee (Admin only)
- `GET /api/users/employees` - Get all employees (Admin only)
- `POST /api/auth/login` - Employee login (Public)

### **Security Features**
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ Email validation
- ✅ Admin-only employee management

## 🧪 **Quick Test Commands**

### **Test Employee Creation (with curl)**
```bash
# First get admin token by logging in
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.com","password":"admin123"}'

# Use the token to create employee
curl -X POST http://localhost:5000/api/users/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"name":"Test Employee","email":"test@company.com","password":"password123"}'
```

### **Test Employee Login (with curl)**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@company.com","password":"password123"}'
```

## 📱 **UI Features**

### **Dashboard Integration**
- **EMPLOYEES button** in header for quick access
- **Employee Management** in dropdown menu
- **Modal overlay** for employee management
- **Responsive design** for mobile/desktop

### **Employee Management UI**
- ✅ Add employee form with validation
- ✅ Employee list with status
- ✅ Edit/Delete actions
- ✅ Password visibility toggle
- ✅ Success/Error notifications

## 🎯 **Expected Results**

### **Admin View**
- Can see all employees
- Can add new employees
- Can delete employees
- Can manage employee status

### **Employee View**
- Can login with email/password
- Can access dashboard
- Can view their profile
- Can work with CRM features

## 🔍 **Troubleshooting**

### **Common Issues**
1. **"Employee role not found"** - Run the database update script
2. **"Invalid credentials"** - Check email/password spelling
3. **"Admin access required"** - Make sure you're logged in as admin
4. **"Email already exists"** - Use a different email address

### **Database Update**
If you get role errors, run:
```sql
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'user', 'manager', 'employee') DEFAULT 'user';
```

## 🎉 **Success Indicators**

✅ Employee created successfully  
✅ Employee can login with email/password  
✅ Employee sees dashboard with their name  
✅ Admin can manage all employees  
✅ Password is properly hashed  
✅ JWT tokens work correctly  

---

**Ready to test? Start the servers and follow the steps above!** 🚀 