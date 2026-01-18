# UniSync Backend - Vercel Serverless Edition

This is a **Vercel-optimized** version of the UniSync backend that has been adapted for serverless deployment while maintaining 100% of the original functionality.

## ✨ What's Changed?

### For Vercel Deployment
- ✅ Created serverless entry point (`api/index.js`)
- ✅ Added `vercel.json` configuration
- ✅ Updated file upload handling (memory storage with cloud integration guide)
- ✅ Optimized for serverless architecture
- ✅ All routes and logic remain unchanged
- ✅ Compatible with both local and Vercel environments

### What Stayed the Same
- ✅ All API endpoints (web + mobile)
- ✅ All controllers and business logic
- ✅ Database models and schemas
- ✅ Authentication and session handling
- ✅ EJS views and templates
- ✅ All features and functionality

## 🚀 Quick Start

### Deploy to Vercel in 3 Steps

```bash
# 1. Run setup script
chmod +x setup.sh
./setup.sh

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel
```

**That's it!** Your backend is now live on Vercel.

## 📋 Detailed Deployment Guide

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or any MongoDB instance)
- Vercel account (free tier works)

### Step 1: Prepare Your Environment

1. **Clone/Download this repository**
   ```bash
   cd modified-backend-vercel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env with your values**
   ```env
   SECRET_KEY=your_secret_key_here
   DB_CONN=mongodb+srv://username:password@cluster.mongodb.net/database
   PORT=3000
   ```

### Step 2: Test Locally (Optional but Recommended)

```bash
# Test with original server
npm run dev

# Or test with Vercel environment
vercel dev
```

### Step 3: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (first time)
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (press enter for default)
# - In which directory is your code located? ./
# - Deploy? Yes
```

#### Option B: Using GitHub + Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Deploy UniSync to Vercel"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings
   - Click "Deploy"

### Step 4: Configure Environment Variables

#### Via Vercel CLI:
```bash
vercel env add SECRET_KEY
# Enter your secret key when prompted

vercel env add DB_CONN
# Enter your MongoDB connection string

vercel env add PORT
# Enter 3000 (or your preferred port)
```

#### Via Vercel Dashboard:
1. Go to your project in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - `SECRET_KEY` → Your session secret
   - `DB_CONN` → Your MongoDB connection string
   - `PORT` → 3000

### Step 5: Production Deployment

```bash
# Deploy to production
vercel --prod
```

Your backend is now live! 🎉

## 🌐 Accessing Your API

After deployment, your API will be available at:
```
https://your-project-name.vercel.app
```

### Example Endpoints:
- **Web Dashboard**: `https://your-project.vercel.app/AdminDashboard`
- **Mobile API**: `https://your-project.vercel.app/api/mobile/events`
- **All your original routes work the same way!**

## 📝 API Documentation

All original endpoints remain unchanged:

### Web Routes (EJS Views)
| Route | Method | Description |
|-------|--------|-------------|
| `/AdminDashboard` | GET | Admin dashboard |
| `/SocietyDashboard` | GET | Society dashboard |
| `/StudentDashboard` | GET | Student dashboard |
| `/add-event` | GET/POST | Add event page/action |
| `/edit-event/:id` | GET/POST | Edit event page/action |
| ... | ... | All other web routes |

### Mobile API Routes
| Route | Method | Description |
|-------|--------|-------------|
| `/api/mobile/events` | GET | Get all events |
| `/api/mobile/society/dashboard` | GET | Society dashboard |
| `/api/mobile/society/add-event` | POST | Add new event |
| `/api/mobile/event/:eventId` | GET/PUT/DELETE | Event operations |
| ... | ... | All other mobile routes |

## ⚠️ Important: File Uploads

### Current Setup
- Uses **memory storage** (temporary)
- Works for Vercel but files don't persist
- Suitable for testing and development

### Production Recommendation
Integrate cloud storage for production:

#### Option 1: Cloudinary (Recommended for images)

```bash
npm install cloudinary multer-storage-cloudinary
```

Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Option 2: AWS S3 (For all file types)

```bash
npm install @aws-sdk/client-s3 multer-s3
```

Add to `.env`:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your_bucket_name
```

See `VERCEL-DEPLOYMENT.md` for integration code examples.

## 🔧 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/public/(.*)",
      "dest": "/Public/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

### Environment Variables
Required:
- `SECRET_KEY` - Session secret key
- `DB_CONN` - MongoDB connection string
- `PORT` - Port number (for local dev)

Optional:
- `NODE_ENV` - Environment (production/development)
- Cloud storage credentials (if integrated)

## 🐛 Troubleshooting

### "Cannot connect to database"
**Solution**: Check your MongoDB connection string and ensure:
- IP whitelist includes `0.0.0.0/0` in MongoDB Atlas
- Connection string is correct
- Database user has proper permissions

### "File upload fails"
**Solution**: 
- Current setup uses memory storage (temporary)
- For production, integrate cloud storage (see above)
- Files in memory are lost after function execution

### "Session not persisting"
**Solution**: 
- Use external session store for production
- Consider Redis (Upstash), MongoDB session store, or Vercel KV
- In-memory sessions work but aren't shared across instances

### "Function timeout"
**Solution**:
- Optimize database queries
- Add proper indexes to MongoDB
- Use connection pooling
- Consider upgrading Vercel plan

### "Cold start is slow"
**Solution**:
- This is normal for serverless
- Keep database connections warm
- Consider Vercel Pro for faster cold starts
- Implement caching where possible

## 📊 Monitoring

### View Logs
```bash
vercel logs
```

### Monitor Functions
- Visit Vercel Dashboard
- Go to your project
- Check "Functions" tab for metrics

## 🔄 Updating Your Deployment

```bash
# Make your changes
git add .
git commit -m "Your changes"

# Deploy
vercel --prod
```

Or just push to GitHub if connected!

## 📚 Additional Resources

- [Full Deployment Guide](./VERCEL-DEPLOYMENT.md)
- [Vercel Documentation](https://vercel.com/docs)
- [Express on Vercel Guide](https://vercel.com/guides/using-express-with-vercel)
- [MongoDB Atlas Serverless](https://www.mongodb.com/docs/atlas/manage-connections-aws-lambda/)

## 🤝 Support

Having issues? Check:
1. Vercel deployment logs: `vercel logs`
2. Function logs in Vercel dashboard
3. MongoDB connection in Atlas
4. Environment variables in Vercel settings

## 📁 Project Structure

```
modified-backend-vercel/
├── api/
│   └── index.js              # Serverless entry point ⭐
├── Config/
│   ├── DbConfig.js           # Database configuration
│   └── multer.js             # File upload (updated) ⭐
├── Controller/               # All controllers (unchanged)
├── Middleware/               # Express middlewares (unchanged)
├── Models/                   # Mongoose models (unchanged)
├── Routes/                   # API routes (unchanged)
├── Views/                    # EJS templates (unchanged)
├── Public/                   # Static files (unchanged)
├── vercel.json              # Vercel config ⭐
├── package.json             # Updated for Vercel ⭐
├── .env.example             # Environment template
├── .gitignore               # Git ignore file
├── setup.sh                 # Setup script
├── VERCEL-DEPLOYMENT.md     # Detailed guide
└── README.md               # This file

⭐ = Modified/Added for Vercel
```

## ✅ Deployment Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] MongoDB connection string ready
- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] Logged into Vercel (`vercel login`)
- [ ] Project deployed (`vercel`)
- [ ] Environment variables set in Vercel
- [ ] Production deployment (`vercel --prod`)
- [ ] API endpoints tested
- [ ] Cloud storage integrated (for production)

## 🎉 You're All Set!

Your UniSync backend is now running on Vercel's global infrastructure with:
- ⚡ Instant global deployment
- 🌍 Edge network distribution
- 📈 Auto-scaling
- 🔒 HTTPS by default
- 💰 Free tier available

**Happy Deploying!** 🚀

---

## License
ISC

## Credits
Modified for Vercel serverless deployment while maintaining all original functionality.
