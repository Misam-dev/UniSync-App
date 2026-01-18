import eventModel from "../Models/eventModel.js";
import studentModel from "../Models/studentModel.js";
import societyModel from "../Models/societyModel.js"


// Show dashboard - list events by society
export const societyDashboard = async (req, res) => {
    try {
        const societyID = req.session.society._id;  
        console.log("Society ID:", societyID);

        const events = await eventModel.find({ createdBy: societyID });

        res.render("Society/dashboard", {
            society: req.session.society,
            events
        });
    } catch (error) {
        console.log("Error loading society dashboard:", error.message);
    }
};


// Add new event
export const addEvent = async (req, res) => {
    try {
        const { title, description } = req.body;
        const poster = req.file.filename;
        const societyID = req.session.society._id;

        const newEvent = new eventModel({
            title,
            description,
            poster,
            createdBy: societyID
        });

        await newEvent.save();
        res.redirect("/SocietyDashboard");
    } catch (error) {
        console.log("Event create error:", error.message);
        res.send("Error creating event");
    }
};


// Edit event
export const updateEvent = async (req, res) => {
    const eventID = req.params.id;

    const updateData = {
        title: req.body.title,
        description: req.body.description
    };

    if (req.file) {
        updateData.poster = req.file.filename;
    }

    await eventModel.findByIdAndUpdate(eventID, updateData);

    res.redirect("/SocietyDashboard");
};


// Delete event
export const deleteEvent = async (req, res) => {
    const eventID = req.params.id;

    await eventModel.findByIdAndDelete(eventID);

    res.redirect("/SocietyDashboard");
};


// View participants
export const eventParticipants = async (req, res) => {
    try {
        const eventID = req.params.id;

        // Populate participants -> then populate userID to get email
        const event = await eventModel.findById(eventID)
            .populate({
                path: "participants",
                populate: { path: "userID", select: "email name" } // get email & name from user model
            })
            .populate({ path: "createdBy", select: "name" }); // optional: society info

        if (!event) {
            req.flash("error", "Event not found");
            return res.redirect("/SocietyDashboard");
        }

        console.log(event); // each participant now has userID.email

        res.render("Society/participants", { event });
    } catch (error) {
        console.log("Event Participants Error:", error.message);
        res.redirect("/SocietyDashboard");
    }
};

export const mobileSocietyDashboard = async (req, res) => {
  try {
    const { societyId } = req.query;

    if (!societyId) {
      return res.status(400).json({ success: false });
    }

    const society = await societyModel.findById(societyId);
    const events = await eventModel.find({ createdBy: societyId });

    res.json({
      success: true,
      society,
      events,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};
