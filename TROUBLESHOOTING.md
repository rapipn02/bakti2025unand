# 🔧 TROUBLESHOOTING - Login & Network Issues

## ✅ **MASALAH SUDAH DIPERBAIKI**

### 🌐 **Network Error Solution**
**MASALAH**: "Network error - please check your connection"  
**PENYEBAB**: Backend tidak berjalan  
**SOLUSI**: ✅ Backend sekarang berjalan di port 4000

### 🔐 **Google Login Error Solution**
**MASALAH**: "Error 401: invalid_client"  
**PENYEBAB**: Google Client ID belum dikonfigurasi  
**SOLUSI**: ✅ Tombol demo dengan panduan setup

---

## 🚀 **Status Saat Ini**

### Backend (Port 4000) ✅
```
✅ Server Running on port 4000
✅ Database Connected (MySQL)
✅ API Endpoints Working:
   - GET /auth/ → List users
   - POST /auth/ → Register (need confirmPassword)
   - POST /auth/login → Login
   - POST /auth/google-login → Google Login
✅ CORS Configured (origin: *)
✅ Prisma ORM Working
```

### Frontend (Port 5175) ✅
```
✅ Vite Dev Server Running
✅ React App Loading
✅ API Configuration: http://localhost:4000
✅ Login page: http://localhost:5175/login
✅ Register page: http://localhost:5175/signup
```

---

## 🧪 **TEST SEKARANG**

### 1. Test Manual Register
1. Buka: http://localhost:5175/signup
2. Isi form:
   - **Nama**: Test Frontend
   - **Email**: testfrontend@example.com  
   - **Password**: 123456
   - **Confirm Password**: 123456
3. Klik "DAFTAR"
4. **Expected**: Berhasil → redirect ke login

### 2. Test Manual Login
1. Buka: http://localhost:5175/login
2. Isi form:
   - **Email**: frontend@test.com
   - **Password**: 123456
   (Atau gunakan email yang baru didaftarkan)
3. Klik "MASUK"
4. **Expected**: Berhasil → redirect ke dashboard

### 3. Test Google Login
1. Di halaman login, klik "Lanjutkan dengan Google"
2. **Expected**: Toast info dengan panduan setup Client ID

---

## 🔍 **Verifikasi Backend API**

### Test dengan PowerShell:
```powershell
# Test Register
Invoke-WebRequest -Uri "http://localhost:4000/auth/" -Method POST -ContentType "application/json" -Body '{"name":"Test User","email":"test123@example.com","password":"123456","confirmPassword":"123456"}'

# Test Login  
Invoke-WebRequest -Uri "http://localhost:4000/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test123@example.com","password":"123456"}'

# Test Google Login
Invoke-WebRequest -Uri "http://localhost:4000/auth/google-login" -Method POST -ContentType "application/json" -Body '{"name":"Google User","email":"google@example.com","password":"google_12345","image":""}'
```

---

## 🐛 **Jika Masih Ada Masalah**

### Network Error di Frontend
1. **Cek Backend**: Pastikan terminal menampilkan "Server Running on port 4000"
2. **Cek Port**: Frontend di 5175, Backend di 4000
3. **Cek CORS**: Headers sudah include `Access-Control-Allow-Origin: *`
4. **Restart**: Ctrl+C pada backend/frontend, lalu jalankan ulang

### Login Failed
1. **Cek Email**: Pastikan email sudah terdaftar (register dulu)
2. **Cek Password**: Minimal 6 karakter
3. **Cek Database**: User ter-save dengan password ter-hash
4. **Cek Console**: Buka browser DevTools untuk melihat error

### Google Login Issues
1. **Demo Mode**: Normal jika menampilkan toast info
2. **Setup**: Ikuti panduan di `GOOGLE_LOGIN_SETUP.md`
3. **Client ID**: Tambahkan ke `FE/.env` sebagai `VITE_GOOGLE_CLIENT_ID`

---

## 📋 **Checklist Debugging**

### ✅ Backend Health Check:
- [ ] Terminal menampilkan "Server Running on port 4000"
- [ ] `http://localhost:4000/auth/` returns user list
- [ ] CORS headers ada di response
- [ ] Prisma client connected

### ✅ Frontend Health Check:  
- [ ] Terminal menampilkan local server URL
- [ ] Browser bisa akses halaman login/register
- [ ] No console errors di browser DevTools
- [ ] API calls keluar di Network tab

### ✅ Integration Test:
- [ ] Register form submit berhasil
- [ ] Login form authenticate berhasil  
- [ ] Toast notifications muncul
- [ ] Redirect setelah login bekerja

---

## 🎯 **Expected Results**

**✅ Register Flow:**
1. Submit form → API POST /auth/
2. Backend validate → Create user in database
3. Frontend show success toast → Redirect to login

**✅ Login Flow:**
1. Submit form → API POST /auth/login  
2. Backend authenticate → Return JWT token
3. Frontend store token → Redirect to dashboard

**✅ Google Login Flow:**
1. Click button → Show setup info (demo mode)
2. Or (if configured) → Google OAuth → Auto login/register

---

## 🔧 **Quick Fix Commands**

### Restart Backend:
```powershell
cd d:\bakti2025-main\BE
# Ctrl+C to stop
npm run dev
```

### Restart Frontend:
```powershell  
cd d:\bakti2025-main\FE
# Ctrl+C to stop
npm run dev
```

### Check Processes:
```powershell
netstat -ano | findstr :4000  # Backend
netstat -ano | findstr :5175  # Frontend
```

---

## ✨ **KESIMPULAN**

**SISTEM SUDAH BERJALAN NORMAL!**

- ✅ Backend API accessible dan tested
- ✅ Frontend dev server running
- ✅ Network connectivity verified  
- ✅ Database integration working
- ✅ CORS properly configured
- ✅ Login/Register endpoints working

**Tinggal test di browser untuk konfirmasi UI flow!** 🚀
