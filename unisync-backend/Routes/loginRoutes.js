import express from "express";
const router = express.Router();
import loginController from "../Controller/loginController.js";

// Web routes
router.get('/', loginController.indexpage);
router.post('/login', loginController.login);

// Mobile API routes
router.post('/logout', loginController.logout);
router.get('/api/current-user', loginController.getCurrentUser);

export default router;
