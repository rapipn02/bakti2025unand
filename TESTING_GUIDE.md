# Test Manual untuk Validasi Login & Register

## Prerequisite
1. Backend running di port 4000
2. Frontend running di port 5173/5174  
3. Database MySQL aktif

## Test 1: Backend API Endpoints

### Test Register API
```bash
curl -X POST http://localhost:4000/auth/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "123456"
  }'
```

**Expected Response:**
```json
{
  "status": 200,
  "account": {
    "id": "uuid-here",
    "name": "Test User",
    "email": "test@example.com",
    "role": "MAHASISWA"
  }
}
```

### Test Login API
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

**Expected Response:**
```json
{
  "status": 200,
  "data": {
    "id": "uuid-here", 
    "name": "Test User",
    "email": "test@example.com",
    "role": "MAHASISWA"
  },
  "token": "jwt-token-here"
}
```

### Test Google Login API
```bash
curl -X POST http://localhost:4000/auth/google-login \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Google User",
    "email": "googleuser@gmail.com",
    "password": "google_12345",
    "image": "https://lh3.googleusercontent.com/..."
  }'
```

## Test 2: Frontend Integration

### Test Manual Register Flow
1. Buka http://localhost:5173/signup
2. Isi form:
   - Nama: "Test User Frontend"
   - Email: "testfe@example.com"
   - Password: "123456"
   - Confirm Password: "123456"
3. Klik "DAFTAR"
4. **Expected**: Toast "Registrasi berhasil", redirect ke login

### Test Manual Login Flow  
1. Buka http://localhost:5173/login
2. Isi form:
   - Email: "testfe@example.com" 
   - Password: "123456"
3. Klik "MASUK"
4. **Expected**: Toast "Login berhasil", redirect ke dashboard

### Test Google Login Flow
1. Buka http://localhost:5173/login
2. Klik tombol "Lanjutkan dengan Google"
3. **If Client ID not configured**: Toast dengan instruksi setup
4. **If Client ID configured**: Google OAuth popup

## Test 3: Database Verification

### Check User Table
```sql
SELECT * FROM User WHERE email IN ('test@example.com', 'testfe@example.com');
```

**Expected**: User records dengan password ter-hash

### Check Password Hashing
```sql
SELECT email, password FROM User LIMIT 5;
```

**Expected**: Password dalam format hash bcrypt ($2b$...)

## Test 4: Error Handling

### Test Invalid Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "notexist@example.com",
    "password": "wrongpass"
  }'
```

**Expected Response:**
```json
{
  "status": 404,
  "message": "User not found!"
}
```

### Test Frontend Validation
1. Buka http://localhost:5173/login
2. Submit tanpa isi email/password
3. **Expected**: Toast error "Email dan password harus diisi!"

## Test 5: JWT Token Validation

### Test Protected Endpoint (if available)
```bash
curl -X GET http://localhost:4000/auth/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## ✅ Success Criteria

**Backend API:**
- ✅ Register endpoint creates user in database
- ✅ Login endpoint returns valid JWT token
- ✅ Google login creates/authenticates user
- ✅ Passwords are properly hashed
- ✅ Error responses are proper

**Frontend Integration:**
- ✅ Register form submits to backend successfully
- ✅ Login form authenticates with backend
- ✅ Google login button shows (demo or working)
- ✅ Success/error toast notifications work
- ✅ Redirects work after successful auth
- ✅ Auth state persists in localStorage

**Database:**
- ✅ Users are created with correct schema
- ✅ Passwords are bcrypt hashed
- ✅ Email uniqueness is enforced
- ✅ Google users can be distinguished

## 🐛 Common Issues & Solutions

**"Connection refused" → Backend not running**
**"Network Error" → Check CORS, port mismatch**  
**"Invalid credentials" → Check password hashing**
**"Google invalid_client" → Need to setup Client ID**
**"Database error" → Check MySQL connection & schema**
