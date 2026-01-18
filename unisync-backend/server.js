import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import Config from "./Middleware/ConfigMiddlewares.js";
import Database from "./Config/DbConfig.js"
const port = process.env.PORT;
const secretKey = process.env.SECRET_KEY;
const db_conn = process.env.DB_CONN;



app.listen(port,() => {

Config(app,express,secretKey);
Database(db_conn); 

console.log(`The Server Is Running On http://localhost:${port}`)

})