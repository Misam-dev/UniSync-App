# UniSync Backend - Vercel Deployment Guide

This is the Vercel-optimized version of the UniSync backend. The application has been modified to work with Vercel's serverless architecture while maintaining all original functionality.

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd modified-backend-vercel
   vercel
   ```

4. **Set Environment Variables**
   After deployment, set your environment variables:
   ```bash
   vercel env add SECRET_KEY
   vercel env add DB_CONN
   vercel env add PORT
   ```

   Or set them in the Vercel Dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add the following variables:
     - `SECRET_KEY`: Your session secret key
     - `DB_CONN`: Your MongoDB connection string
     - `PORT`: 3000 (or any port, mainly for local dev)

5. **Redeploy after adding env variables**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables in the settings
   - Deploy!

## 📝 Environment Variables

Create a `.env` file for local development (DO NOT commit this file):

```env
SECRET_KEY=your_secret_key_here
DB_CONN=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3000
```

For Vercel production, add these in:
- Vercel Dashboard → Project Settings → Environment Variables

## 🔧 Key Changes from Original

### 1. **Serverless Entry Point**
- Created `api/index.js` as the main serverless function
- Removed `app.listen()` as Vercel handles this

### 2. **File Upload Handling**
- Changed from disk storage to memory storage
- **Important**: For production, integrate cloud storage (AWS S3, Cloudinary, etc.)
- Current setup stores files in memory (temporary)

### 3. **Static Files**
- Public folder is served through Vercel's routing
- Assets in `/Public` directory are accessible

### 4. **Database Connection**
- Uses MongoDB connection pooling (works well with serverless)
- Connection is maintained across invocations

## ⚠️ Important Notes

### File Uploads
The current file upload configuration uses memory storage, which is suitable for Vercel but has limitations:

- Files are stored temporarily in memory
- Not persistent across function invocations
- **Recommended**: Integrate with cloud storage for production

#### Integrating Cloud Storage (Recommended)

**Option A: Cloudinary**
```bash
npm install cloudinary
```

Update `Config/multer.js`:
```javascript
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'unisync-events',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
  }
});
```

**Option B: AWS S3**
```bash
npm install multer-s3 @aws-sdk/client-s3
```

### Session Storage
The current session storage uses in-memory storage. For production with multiple serverless instances, consider:
- Redis (via Upstash)
- MongoDB session store
- Vercel KV

## 🧪 Testing Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   This runs the original `server.js` for local testing

3. **Test serverless function locally**
   ```bash
   vercel dev
   ```
   This simulates Vercel's environment locally

## 📁 Project Structure

```
modified-backend-vercel/
├── api/
│   └── index.js           # Vercel serverless entry point
├── Config/
│   ├── DbConfig.js        # Database configuration
│   └── multer.js          # File upload config (updated for Vercel)
├── Controller/            # Request handlers
├── Middleware/            # Express middlewares
├── Models/                # Mongoose models
├── Routes/                # API routes
├── Views/                 # EJS templates
├── Public/                # Static assets
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies
├── server.js             # Original server (for local dev)
└── .env                  # Environment variables (not committed)
```

## 🔄 API Endpoints

All your original endpoints remain unchanged:

### Web Routes (EJS)
- `/AdminDashboard` - Admin dashboard
- `/SocietyDashboard` - Society dashboard
- `/StudentDashboard` - Student dashboard
- And all other web routes...

### Mobile API Routes
- `GET /api/mobile/events` - Get all events
- `GET /api/mobile/society/dashboard` - Society dashboard
- `POST /api/mobile/society/add-event` - Add event
- And all other mobile routes...

## 🐛 Troubleshooting

### Issue: Database connection timeout
**Solution**: Ensure your MongoDB cluster allows connections from anywhere (0.0.0.0/0) or add Vercel's IP ranges

### Issue: File uploads not working
**Solution**: Integrate cloud storage (Cloudinary/S3) as shown above

### Issue: Session not persisting
**Solution**: Use external session store (Redis/MongoDB) for production

### Issue: Cold starts
**Solution**: This is normal for serverless. Consider:
- Using Vercel Pro for faster cold starts
- Implementing connection pooling
- Using edge functions for critical paths

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Express on Vercel](https://vercel.com/guides/using-express-with-vercel)
- [MongoDB Serverless Best Practices](https://www.mongodb.com/docs/atlas/manage-connections-aws-lambda/)

## 🤝 Support

For issues specific to Vercel deployment, check:
1. Vercel deployment logs
2. Function logs in Vercel dashboard
3. Network tab in browser for API errors

## 📄 License

ISC

---

**Note**: This version is optimized for Vercel's serverless architecture. The original functionality and API endpoints remain unchanged.
