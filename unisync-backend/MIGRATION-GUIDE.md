# Migration Guide - Upgrading Your Backend for Mobile Support

This guide will help you upgrade your existing backend to support the React Native mobile app while keeping your web app working.

## 🎯 Overview

Your current backend works perfectly with the EJS web app. This modification adds:
- ✅ Mobile API endpoints
- ✅ CORS support
- ✅ Smart response handling (redirects for web, JSON for mobile)
- ✅ All existing web functionality preserved

## 📋 Migration Steps

### Step 1: Backup Your Current Backend

```bash
# Create a backup of your current backend
cp -r Navttc-Project Navttc-Project-backup
```

### Step 2: Install New Dependency

```bash
cd Navttc-Project
npm install cors
```

### Step 3: Replace Files

Replace these files with the modified versions:

#### Required Files:
1. ✅ `package.json` - Added cors dependency
2. ✅ `Middleware/ConfigMiddlewares.js` - Added CORS configuration
3. ✅ `Controller/loginController.js` - Added mobile support

#### New Files:
4. ✅ `Controller/mobileStudentController.js` - NEW
5. ✅ `Controller/mobileSocietyController.js` - NEW

#### Updated Routes:
6. ✅ `Routes/loginRoutes.js` - Added mobile endpoints
7. ✅ `Routes/societyRoutes.js` - Added mobile API routes
8. ✅ `Routes/studentRoutes.js` - Added mobile API routes

### Step 4: Test Web App Still Works

```bash
npm start
```

Visit `http://localhost:3000` in your browser:
1. ✅ Login with existing credentials
2. ✅ Test society dashboard
3. ✅ Test student dashboard
4. ✅ Create an event
5. ✅ Join an event

If everything works, your web app is still functional! ✨

### Step 5: Test Mobile API

#### Using cURL:

```bash
# Test login API
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'
```

#### Using Postman:

1. Create new POST request to `http://localhost:3000/login`
2. Set Headers:
   - `Content-Type: application/json`
   - `Accept: application/json`
3. Set Body (raw JSON):
   ```json
   {
     "email": "student@example.com",
     "password": "password123"
   }
   ```
4. Send request
5. Should receive JSON response with user data

### Step 6: Connect Mobile App

1. Find your computer's IP address
2. Update mobile app's `api.ts` file:
   ```typescript
   const API_BASE_URL = 'http://YOUR_IP:3000';
   ```
3. Start mobile app: `npm start`
4. Test login from mobile app

## 🔄 What Changed?

### Before (Web Only)
```
Client (Browser) → Backend → EJS Render → HTML Response
```

### After (Web + Mobile)
```
Client (Browser) → Backend → EJS Render → HTML Response
Client (Mobile)  → Backend → JSON Response
```

## 📊 File-by-File Changes

### 1. package.json
**What Changed:**
- Added `cors` dependency

**Why:**
- Enable mobile apps to make API requests

### 2. ConfigMiddlewares.js
**What Changed:**
- Added CORS middleware with configuration
- Changed `saveUninitialized` to `false`
- Added cookie security settings

**Why:**
- Allow mobile app requests
- Better security
- Support for both platforms

### 3. loginController.js
**What Changed:**
- Added detection for mobile requests
- Returns JSON for mobile, redirects for web
- Added `logout` function
- Added `getCurrentUser` function

**Why:**
- Support both platforms with same endpoint
- Mobile apps need JSON responses
- Provide user session info

### 4. mobileStudentController.js (NEW)
**What It Does:**
- Mobile-specific student endpoints
- Dashboard data
- Join/leave events
- Get events list

**Why Separate File:**
- Keep web and mobile logic organized
- Easier to maintain
- Clear separation of concerns

### 5. mobileSocietyController.js (NEW)
**What It Does:**
- Mobile-specific society endpoints
- Dashboard data
- Create/edit/delete events
- View participants

**Why Separate File:**
- Same reasons as student controller
- Society has different data needs
- Independent testing

### 6. Routes Files
**What Changed:**
- Added mobile API routes
- Kept existing web routes
- Clear comments separating web vs mobile

**Why:**
- Support both platforms
- Maintain backward compatibility
- Clear organization

## ✅ Compatibility Matrix

| Feature | Web App | Mobile App |
|---------|---------|------------|
| Login | ✅ Redirects | ✅ JSON |
| Society Dashboard | ✅ EJS | ✅ JSON |
| Student Dashboard | ✅ EJS | ✅ JSON |
| Create Event | ✅ Works | ✅ Works |
| Join Event | ✅ Works | ✅ Works |
| View Participants | ✅ Works | ✅ Works |
| Image Upload | ✅ Works | ✅ Works |
| Sessions | ✅ Works | ✅ AsyncStorage |

## 🔍 Testing Checklist

### Web App Testing
- [ ] Homepage loads
- [ ] Login works (students)
- [ ] Login works (societies)
- [ ] Student can view events
- [ ] Student can join events
- [ ] Society can create events
- [ ] Society can edit events
- [ ] Society can delete events
- [ ] Society can view participants
- [ ] Image upload works
- [ ] Logout works

### Mobile App Testing
- [ ] Can connect to backend
- [ ] Login works (students)
- [ ] Login works (societies)
- [ ] Student dashboard loads
- [ ] Society dashboard loads
- [ ] Can view all events
- [ ] Can create event with image
- [ ] Can join event
- [ ] Can leave event
- [ ] Can view participants
- [ ] Logout works

## 🐛 Common Issues & Solutions

### Issue 1: Web app broken after migration
**Solution:**
```bash
# Restore from backup
rm -rf Navttc-Project
cp -r Navttc-Project-backup Navttc-Project
cd Navttc-Project
npm install
```

### Issue 2: CORS errors
**Solution:**
- Verify `cors` is installed: `npm list cors`
- Check CORS middleware is added
- Restart server

### Issue 3: Mobile app can't connect
**Solution:**
- Check IP address is correct
- Both devices on same WiFi
- Backend is running
- Test in browser: `http://YOUR_IP:3000`

### Issue 4: Login returns HTML instead of JSON
**Solution:**
- Verify mobile app sends `Accept: application/json` header
- Check axios configuration in `api.ts`

### Issue 5: Image upload fails from mobile
**Solution:**
- Check `Content-Type: multipart/form-data`
- Verify `public/uploads` folder exists
- Check multer configuration

## 📝 Rollback Plan

If something goes wrong:

### Quick Rollback
```bash
# Stop server
# Delete modified folder
rm -rf Navttc-Project

# Restore backup
cp -r Navttc-Project-backup Navttc-Project

# Start again
cd Navttc-Project
npm start
```

### Selective Rollback
Only revert specific files:
```bash
cp Navttc-Project-backup/Middleware/ConfigMiddlewares.js Navttc-Project/Middleware/
cp Navttc-Project-backup/Controller/loginController.js Navttc-Project/Controller/
# etc...
```

## 🎓 Best Practices

### During Migration
1. ✅ Always backup first
2. ✅ Test web app after each change
3. ✅ Make one change at a time
4. ✅ Keep backup until fully tested
5. ✅ Document any custom changes

### After Migration
1. ✅ Test thoroughly on both platforms
2. ✅ Update documentation
3. ✅ Train team on new endpoints
4. ✅ Monitor logs for errors
5. ✅ Delete backup after 1 week of stable operation

## 📚 Additional Resources

- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express.js Guide](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [React Native Networking](https://reactnative.dev/docs/network)

## 🆘 Need Help?

1. Check server console for errors
2. Check MongoDB logs
3. Test with Postman first
4. Verify all files are replaced
5. Check npm dependencies installed
6. Ensure MongoDB is running

## ✨ Success Indicators

You'll know migration is successful when:
- ✅ Web app works as before
- ✅ Mobile app can login
- ✅ Both can create/view events
- ✅ No CORS errors
- ✅ Sessions work on both
- ✅ Image uploads work
- ✅ All features functional

---

**Congratulations!** You now have a unified backend supporting both web and mobile! 🎉
