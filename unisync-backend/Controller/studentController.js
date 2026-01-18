import eventModel from "../Models/eventModel.js";
import studentModel from "../Models/studentModel.js";
import societyModel from "../Models/societyModel.js";

// Show all live events
// Show all live events
export const studentDashboard = async (req, res) => {
    try {
        const student = req.session.student;
         console.log("Student ID:", student);
        if (!student) return res.redirect("/");

        // Populate the createdBy field to get society info
        const events = await eventModel.find()
            .populate({ path: "createdBy", select: "name" }); // <-- populate society name

        const participatedIds = events
            .filter(event => event.participants.includes(student._id))
            .map(event => event._id.toString());

        res.render("Student/dashboard", {
            student,
            events,
            participatedIds
        });

    } catch (error) {
        console.log("Student Dashboard Error:", error.message);
        res.redirect("/");
    }
};


// Participate in an event
export const participateEvent = async (req, res) => {
    try {
        const student = req.session.student;
        if (!student) return res.redirect("/");

        const eventID = req.params.id;

        await eventModel.findByIdAndUpdate(eventID, {
            $addToSet: { participants: student._id } // prevents duplicates
        });

        res.redirect("/StudentDashboard");
    } catch (error) {
        console.log("Participate Event Error:", error.message);
        res.redirect("/StudentDashboard");
    }
};

// My Participations Page
export const myParticipations = async (req, res) => {
    try {
        const student = req.session.student;
        if (!student) return res.redirect("/");

        // Find all events the student participated in and populate the society info
        const participatedEvents = await eventModel.find({
            participants: student._id
        }).populate({ path: "createdBy", select: "name" }); // <-- populate society name

        res.render("Student/Participated-Events", {
            student,
            participatedEvents
        });

    } catch (error) {
        console.log("My Participations Error:", error.message);
        res.redirect("/StudentDashboard");
    }
};
