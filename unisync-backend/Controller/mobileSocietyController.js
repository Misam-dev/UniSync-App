import eventModel from "../Models/eventModel.js";
import societyModel from "../Models/societyModel.js";
import studentModel from "../Models/studentModel.js";

// Mobile API: Get society dashboard
export const mobileSocietyDashboard = async (req, res) => {
    try {
        const { societyId } = req.query;

        if (!societyId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Society ID is required' 
            });
        }

        // Get society details with populated userID
        const society = await societyModel.findById(societyId)
            .populate('userID', 'email');

        if (!society) {
            return res.status(404).json({ 
                success: false, 
                message: 'Society not found' 
            });
        }

        // Get all events created by this society
        const events = await eventModel.find({ createdBy: societyId })
            .populate('participants', 'name rollno department')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            society: {
                _id: society._id,
                name: society.name,
                email: society.userID?.email
            },
            events: events.map(event => ({
                _id: event._id,
                title: event.title,
                description: event.description,
                poster: event.poster,
                participants: event.participants,
                createdAt: event.createdAt
            }))
        });

    } catch (error) {
        console.error('Mobile Society Dashboard Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching dashboard data' 
        });
    }
};

// Mobile API: Add new event
export const mobileAddEvent = async (req, res) => {
    try {
        const { title, description, societyId } = req.body;
        
        if (!title || !description || !societyId) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        const poster = req.file ? req.file.filename : null;

        if (!poster) {
            return res.status(400).json({ 
                success: false, 
                message: 'Event poster is required' 
            });
        }

        const newEvent = new eventModel({
            title,
            description,
            poster,
            createdBy: societyId
        });

        await newEvent.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event: {
                _id: newEvent._id,
                title: newEvent.title,
                description: newEvent.description,
                poster: newEvent.poster,
                createdAt: newEvent.createdAt
            }
        });

    } catch (error) {
        console.error('Mobile Add Event Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error creating event' 
        });
    }
};

// Mobile API: Update event
export const mobileUpdateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { title, description } = req.body;

        const event = await eventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ 
                success: false, 
                message: 'Event not found' 
            });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (req.file) updateData.poster = req.file.filename;

        await eventModel.findByIdAndUpdate(eventId, updateData);

        res.json({
            success: true,
            message: 'Event updated successfully'
        });

    } catch (error) {
        console.error('Mobile Update Event Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating event' 
        });
    }
};

// Mobile API: Delete event
export const mobileDeleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await eventModel.findByIdAndDelete(eventId);
        if (!event) {
            return res.status(404).json({ 
                success: false, 
                message: 'Event not found' 
            });
        }

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });

    } catch (error) {
        console.error('Mobile Delete Event Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting event' 
        });
    }
};

// Mobile API: Get event participants
export const mobileGetParticipants = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await eventModel.findById(eventId)
            .populate({
                path: 'participants',
                populate: { path: 'userID', select: 'email' }
            })
            .populate('createdBy', 'name');

        if (!event) {
            return res.status(404).json({ 
                success: false, 
                message: 'Event not found' 
            });
        }

        res.json({
            success: true,
            event: {
                _id: event._id,
                title: event.title,
                society: event.createdBy?.name
            },
            participants: event.participants.map(p => ({
                _id: p._id,
                name: p.name,
                email: p.userID?.email,
                rollno: p.rollno,
                department: p.department
            }))
        });

    } catch (error) {
        console.error('Mobile Get Participants Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching participants' 
        });
    }
};

// Mobile API: Get single event details
export const mobileGetEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await eventModel.findById(eventId)
            .populate('createdBy', 'name')
            .populate({
                path: 'participants',
                populate: { path: 'userID', select: 'email' }
            });

        if (!event) {
            return res.status(404).json({ 
                success: false, 
                message: 'Event not found' 
            });
        }

        res.json({
            success: true,
            event: {
                _id: event._id,
                title: event.title,
                description: event.description,
                poster: event.poster,
                society: {
                    _id: event.createdBy._id,
                    name: event.createdBy.name
                },
                participants: event.participants.map(p => ({
                    _id: p._id,
                    name: p.name,
                    email: p.userID?.email,
                    rollno: p.rollno,
                    department: p.department
                })),
                createdAt: event.createdAt
            }
        });

    } catch (error) {
        console.error('Mobile Get Event Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching event details' 
        });
    }
};

// Mobile API: Search events
export const mobileSearchEvents = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ 
                success: false, 
                message: 'Search query is required' 
            });
        }

        const events = await eventModel.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        })
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            success: true,
            events: events.map(event => ({
                _id: event._id,
                title: event.title,
                description: event.description,
                poster: event.poster,
                society: event.createdBy?.name || 'Unknown',
                participants: event.participants.length,
                createdAt: event.createdAt
            }))
        });

    } catch (error) {
        console.error('Mobile Search Events Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error searching events' 
        });
    }
};
