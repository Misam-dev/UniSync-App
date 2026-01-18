# Quick Start Guide - Modified Backend

Get your backend running in 5 minutes!

## 🚀 Super Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Start MongoDB (if not running)
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB

# 4. Start server
npm run dev
```

Server runs on: `http://localhost:3000`

## 📱 For Mobile App

### Find Your IP
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Update Mobile App
Edit `app/services/api.ts`:
```typescript
const API_BASE_URL = 'http://YOUR_IP:3000';
```

## ✅ Test It Works

### Web App
1. Open browser: `http://localhost:3000`
2. Login with existing credentials
3. Test create/view events

### Mobile App
1. Update API_BASE_URL with your IP
2. Start mobile app: `npm start`
3. Scan QR code with Expo Go
4. Login and test features

## 🎯 Default Credentials

Create users using your existing system or use:
- Whatever credentials you already have in MongoDB

## 📋 Project Structure

```
modified-backend/
├── Config/           # MongoDB + Multer
├── Controller/       # Business logic
├── Middleware/       # CORS + Session + Routes
├── Models/           # Database schemas
├── Routes/           # API endpoints
├── Public/           # Static files + uploads
├── Views/            # EJS templates
├── server.js         # Entry point
├── package.json      # Dependencies
└── .env              # Configuration
```

## 🔧 Scripts

```bash
npm run dev    # Development with auto-reload
npm start      # Production
```

## 🌐 Key Endpoints

### For Web (Browser)
- `GET /` - Home/Login page
- `GET /SocietyDashboard` - Society dashboard
- `GET /StudentDashboard` - Student dashboard

### For Mobile (JSON API)
- `POST /login` - Login
- `GET /api/mobile/events` - All events
- `GET /api/mobile/society/dashboard?societyId=X` - Society data
- `GET /api/mobile/student/dashboard?studentId=X` - Student data

## 💡 Tips

1. **Testing API**: Use Postman or cURL
2. **Check Logs**: Watch console for errors
3. **CORS Issues**: Ensure mobile app IP is correct
4. **File Uploads**: Images saved to `public/uploads/`

## 🐛 Troubleshooting

**Can't connect:**
- Check MongoDB is running
- Verify `.env` settings
- Check firewall

**Mobile can't connect:**
- Use correct IP address
- Same WiFi network
- Backend is running

**Web app broken:**
- Check all files copied correctly
- Run `npm install` again
- Check MongoDB connection

## 📚 Full Documentation

- `README.md` - Complete documentation
- `MIGRATION-GUIDE.md` - Upgrade guide
- `API-REFERENCE.md` - All endpoints

## 🆘 Quick Fixes

```bash
# Reset everything
rm -rf node_modules
npm install
npm run dev

# Check MongoDB
# macOS: brew services list
# Linux: sudo systemctl status mongod

# Test backend
curl http://localhost:3000
```

## ✨ That's It!

You're ready to go! The backend now supports both web and mobile apps simultaneously.

**Questions?** Check the full README.md for detailed information.
