import flash from "connect-flash";
import session from "express-session";
import cors from "cors";
import adminRouter from "../Routes/adminRoutes.js";
import loginrouter from "../Routes/loginRoutes.js";
import societyrouter from "../Routes/societyRoutes.js";
import studentrouter from "../Routes/studentRoutes.js";

async function config(app, express, secretKey) {
    // CORS Configuration - Allow mobile app and web access
    app.use(cors({
        origin: function(origin, callback) {
            // Allow requests with no origin (mobile apps, Postman, etc.)
            if (!origin) return callback(null, true);
            
            // Allow localhost and local network IPs for development
            const allowedOrigins = [
                'http://localhost:8081',
                'http://localhost:19006',
                'http://localhost:3000',
                /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:8081$/,
                /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:19006$/,
                /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:3000$/,
                /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:8081$/,
                /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:19006$/,
            ];
            
            const isAllowed = allowedOrigins.some(pattern => {
                if (typeof pattern === 'string') {
                    return origin === pattern;
                }
                return pattern.test(origin);
            });
            
            if (isAllowed) {
                callback(null, true);
            } else {
                // In development, allow all origins
                console.log('Origin allowed (dev mode):', origin);
                callback(null, true);
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
    }));

    // Middleware
    app.use(express.static("public"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Session middleware
    app.use(session({
        secret: secretKey,
        resave: false,
        saveUninitialized: false, // Changed to false for better security
        cookie: {
            secure: false, // Set to true in production with HTTPS
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    }));
    
    // Flash middleware
    app.use(flash());
    app.use(function(req, res, next) {
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.formData = req.flash("formData")[0] || {};
        next();
    });

    // Routes
    app.use(adminRouter);
    app.use(loginrouter);
    app.use(societyrouter);
    app.use(studentrouter);
}

export default config;
