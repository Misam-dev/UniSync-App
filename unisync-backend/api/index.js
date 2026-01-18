import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Config from "../Middleware/ConfigMiddlewares.js";
import Database from "../Config/DbConfig.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const secretKey = process.env.SECRET_KEY;
const db_conn = process.env.DB_CONN;

// Set views directory explicitly for Vercel
app.set('views', path.join(__dirname, '..', 'Views'));
app.set('view engine', 'ejs');

// Initialize configuration and database
Config(app, express, secretKey);
Database(db_conn);

// Export the Express app as a serverless function
export default app;
