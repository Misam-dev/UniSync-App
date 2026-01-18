import bcrypt from "bcrypt";
import adminModel from "../Models/adminModel.js";
import societyModel from "../Models/societyModel.js";
import userModel from "../Models/userModel.js";
import studentModel from "../Models/studentModel.js";

// Render index page for web
async function indexpage(req, res) {
    res.render('./Public-pages/index');
}

// Handle login for web (redirects) and mobile (JSON response)
async function login(req, res) {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email);

        if (!email || !password) {
            // Check if request is from mobile app (JSON expected)
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'All fields required' 
                });
            }
            req.flash("error", "All fields required");
            return res.redirect("/");
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid credentials' 
                });
            }
            req.flash("error", "Invalid Credentials");
            return res.redirect("/");
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid credentials' 
                });
            }
            req.flash("error", "Invalid Credentials");
            return res.redirect("/");
        }

        // Store user in session
        req.session.user = user;

        // Handle Admin role
        if (user.role === "Admin") {
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.json({
                    success: true,
                    user: {
                        id: user._id.toString(),
                        email: user.email,
                        role: 'admin'
                    },
                    redirectUrl: '/AdminDashboard'
                });
            }
            return res.redirect("/AdminDashboard");
        }

        // Handle Society role
        if (user.role === "Society") {
            const society = await societyModel.findOne({ userID: user._id });
            req.session.society = society;

            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.json({
                    success: true,
                    user: {
                        id: society._id.toString(),
                        userId: user._id.toString(),
                        email: user.email,
                        name: society.name,
                        role: 'society'
                    },
                    redirectUrl: '/SocietyDashboard'
                });
            }
            return res.redirect("/SocietyDashboard");
        }

        // Handle Student role
        if (user.role === "Student") {
            const student = await studentModel.findOne({ userID: user._id })
                .populate('userID', 'email');
            
            req.session.student = student;

            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.json({
                    success: true,
                    user: {
                        id: student._id.toString(),
                        userId: user._id.toString(),
                        email: user.email,
                        name: student.name,
                        rollno: student.rollno,
                        department: student.department,
                        role: 'student'
                    },
                    redirectUrl: '/StudentDashboard'
                });
            }
            return res.redirect("/StudentDashboard");
        }

    } catch (error) {
        console.log("Login Error:", error.message);
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(500).json({ 
                success: false, 
                message: 'Server error' 
            });
        }
        req.flash("error", "Something went wrong");
        return res.redirect("/");
    }
}

// Logout handler - works for both web and mobile
async function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Error logging out' 
                });
            }
            return res.redirect('/');
        }
        
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.json({ 
                success: true, 
                message: 'Logged out successfully' 
            });
        }
        res.redirect('/');
    });
}

// Get current user - for mobile app
async function getCurrentUser(req, res) {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authenticated' 
            });
        }

        const user = req.session.user;
        let userData = {
            id: user._id.toString(),
            email: user.email,
            role: user.role.toLowerCase()
        };

        if (user.role === 'Society' && req.session.society) {
            userData.societyId = req.session.society._id.toString();
            userData.name = req.session.society.name;
        } else if (user.role === 'Student' && req.session.student) {
            userData.studentId = req.session.student._id.toString();
            userData.name = req.session.student.name;
            userData.rollno = req.session.student.rollno;
            userData.department = req.session.student.department;
        }

        res.json({
            success: true,
            user: userData
        });

    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
}

export default { login, indexpage, logout, getCurrentUser };
