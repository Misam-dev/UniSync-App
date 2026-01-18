import express from "express";
import { upload } from "../Config/multer.js";
import {
    societyDashboard,
    addEvent,
    updateEvent,
    deleteEvent,
    eventParticipants
} from "../Controller/societyController.js";

import {
    mobileSocietyDashboard,
    mobileAddEvent,
    mobileUpdateEvent,
    mobileDeleteEvent,
    mobileGetParticipants,
    mobileGetEvent,
    mobileSearchEvents
} from "../Controller/mobileSocietyController.js";

import eventModel from "../Models/eventModel.js";

const router = express.Router();

// ==================== WEB ROUTES ====================

// Society Dashboard (Web)
router.get("/SocietyDashboard", societyDashboard);

// Add Event Page (Web)
router.get("/add-event", (req, res) => {
    res.render("Society/Add-event");
});

// Add Event (Web)
router.post("/add-event", upload.single("poster"), addEvent);

// Edit Event Page (Web)
router.get("/edit-event/:id", async (req, res) => {
    const event = await eventModel.findById(req.params.id);
    res.render("Society/edit-event", { event });
});

// Edit Event (Web)
router.post("/edit-event/:id", upload.single("poster"), updateEvent);

// Delete Event (Web)
router.get("/delete-event/:id", deleteEvent);

// View Participants (Web)
router.get("/participants/:id", eventParticipants);

// ==================== MOBILE API ROUTES ====================

// Get Society Dashboard (Mobile)
router.get('/api/mobile/society/dashboard', mobileSocietyDashboard);

// Add New Event (Mobile)
router.post('/api/mobile/society/add-event', upload.single("poster"), mobileAddEvent);

// Update Event (Mobile)
router.put('/api/mobile/event/:eventId', upload.single("poster"), mobileUpdateEvent);

// Delete Event (Mobile)
router.delete('/api/mobile/event/:eventId', mobileDeleteEvent);

// Get Event Participants (Mobile)
router.get('/api/mobile/event/:eventId/participants', mobileGetParticipants);

// Get Single Event Details (Mobile)
router.get('/api/mobile/event/:eventId', mobileGetEvent);

// Search Events (Mobile)
router.get('/api/mobile/events/search', mobileSearchEvents);

// Get All Events (Mobile - used by student explore page)
router.get('/api/mobile/events', async (req, res) => {
    try {
        const events = await eventModel.find()
            .populate('createdBy', 'name')
            .populate('participants', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            events: events.map(event => ({
                _id: event._id,
                title: event.title,
                description: event.description,
                poster: event.poster,
                society: event.createdBy?.name || 'Unknown',
                societyId: event.createdBy?._id,
                participants: event.participants.length,
                createdAt: event.createdAt
            }))
        });
    } catch (error) {
        console.error('Get All Events Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching events' 
        });
    }
});

export default router;
