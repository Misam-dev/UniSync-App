import express from "express";
import { 
    studentDashboard, 
    participateEvent, 
    myParticipations 
} from "../Controller/studentController.js";

import {
    mobileStudentDashboard,
    mobileGetAllEvents,
    mobileJoinEvent,
    mobileLeaveEvent,
    mobileGetMyEvents
} from "../Controller/mobileStudentController.js";

const router = express.Router();

// ==================== WEB ROUTES ====================

// Student Dashboard (Web)
router.get("/StudentDashboard", studentDashboard);

// Participate in Event (Web)
router.get("/participate/:id", participateEvent);

// View My Events (Web)
router.get("/my-events", myParticipations);

// ==================== MOBILE API ROUTES ====================

// Get Student Dashboard (Mobile)
router.get('/api/mobile/student/dashboard', mobileStudentDashboard);

// Get All Events (Mobile)
router.get('/api/mobile/student/events', mobileGetAllEvents);

// Join Event (Mobile)
router.post('/api/mobile/student/join-event/:eventId', mobileJoinEvent);

// Leave Event (Mobile)
router.post('/api/mobile/student/leave-event/:eventId', mobileLeaveEvent);

// Get My Joined Events (Mobile)
router.get('/api/mobile/student/:studentId/events', mobileGetMyEvents);

export default router;
