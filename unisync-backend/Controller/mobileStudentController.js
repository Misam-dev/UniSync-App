import eventModel from "../Models/eventModel.js";
import studentModel from "../Models/studentModel.js";
import societyModel from "../Models/societyModel.js";

// Mobile API: Get student dashboard data
export const mobileStudentDashboard = async (req, res) => {
    try {
        const { studentId } = req.query;

        if (!studentId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Student ID is required' 
            });
        }

        // Get student details
        const student = await studentModel.findById(studentId)
            .populate('userID', 'email');

        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: 'Student not found' 
            });
        }

        // Get upcoming events (next 30 days)
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setDate(today.getDate() + 30);

        const upcomingEvents = await eventModel.find({
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Events from last 30 days
        })
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get student's joined events
        const joinedEvents = await eventModel.find({
            participants: studentId
        });

        // Get random featured society
        const societies = await societyModel.find().limit(10);
        const featuredSociety = societies.length > 0 
            ? societies[Math.floor(Math.random() * societies.length)]
            : null;

        // Calculate stats
        const stats = [
            { 
                label: 'Events Joined', 
                value: joinedEvents.length.toString(), 
                icon: '🎉', 
                color: ['#667eea', '#764ba2'] 
            },
            { 
                label: 'Societies', 
                value: societies.length.toString(), 
                icon: '🏛️', 
                color: ['#f093fb', '#f5576c'] 
            },
            { 
                label: 'Hours Attended', 
                value: (joinedEvents.length * 2).toString(), 
                icon: '⏱️', 
                color: ['#4facfe', '#00f2fe'] 
            }
        ];

        res.json({
            success: true,
            student: {
                id: student._id,
                name: student.name,
                email: student.userID?.email,
                rollno: student.rollno,
                department: student.department
            },
            stats,
            upcomingEvents: upcomingEvents.map(event => ({
                id: event._id,
                title: event.title,
                society: event.createdBy?.name || 'Unknown Society',
                date: event.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                time: new Date(event.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                attendees: event.participants.length,
                description: event.description,
                poster: event.poster
            })),
            featuredSociety: featuredSociety ? {
                icon: '🎭',
                title: featuredSociety.name,
                description: 'Join us for amazing events this semester!'
            } : null
        });

    } catch (error) {
        console.error('Mobile Student Dashboard Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching dashboard data' 
        });
    }
};

// Mobile API: Get all events
export const mobileGetAllEvents = async (req, res) => {
    try {
        const events = await eventModel.find()
            .populate('createdBy', 'name')
            .populate('participants', 'name rollno')
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
                participantsList: event.participants,
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
};

// Mobile API: Join an event
export const mobileJoinEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Student ID is required' 
            });
        }

        const event = await eventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ 
                success: false, 
                message: 'Event not found' 
            });
        }

        // Check if already registered
        if (event.participants.includes(studentId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Already registered for this event' 
            });
        }

        // Add student to participants
        event.participants.push(studentId);
        await event.save();

        res.json({
            success: true,
            message: 'Successfully joined event'
        });

    } catch (error) {
        console.error('Join Event Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error joining event' 
        });
    }
};

// Mobile API: Leave an event
export const mobileLeaveEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Student ID is required' 
            });
        }

        const event = await eventModel.findById(eventId);
        if (!event) {
            return res.status(404).json({ 
                success: false, 
                message: 'Event not found' 
            });
        }

        // Remove student from participants
        event.participants = event.participants.filter(
            p => p.toString() !== studentId
        );
        await event.save();

        res.json({
            success: true,
            message: 'Successfully left event'
        });

    } catch (error) {
        console.error('Leave Event Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error leaving event' 
        });
    }
};

// Mobile API: Get student's joined events
export const mobileGetMyEvents = async (req, res) => {
    try {
        const { studentId } = req.params;

        const events = await eventModel.find({
            participants: studentId
        })
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            events: events.map(event => ({
                _id: event._id,
                title: event.title,
                description: event.description,
                poster: event.poster,
                society: event.createdBy?.name || 'Unknown',
                createdAt: event.createdAt
            }))
        });

    } catch (error) {
        console.error('Get My Events Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching events' 
        });
    }
};
