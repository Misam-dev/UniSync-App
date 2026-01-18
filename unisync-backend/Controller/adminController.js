import bcrypt from "bcrypt";
import adminModel from "../Models/adminModel.js";
import userModel from "../Models/userModel.js";
import studentModel from "../Models/studentModel.js"
import societyModel from "../Models/societyModel.js";

async function admindash(req,res) {

const students = await userModel.find({role:"Student"});
const st_length = students.length;
const stu_info = await studentModel.find().populate("userID");

const society = await userModel.find({role:"Society"});
const soci_length = society.length;
const society_info = await societyModel.find().populate("userID");

  res.render("Admin/Dashboard", { st_length , soci_length , stu_info , society_info});

    
}


async function addstudentpage(req,res) {

  res.render('./Admin/AddStudent')
    
}

async function addscocietypage(req,res) {

    res.render('./Admin/AddSociety')
    
}



async function addstudent(req,res) {


       try {
    const {name, email, rollno,department,password } = req.body;
    
        const plainPass = password;
        const hashPass = await bcrypt.hash(plainPass,10);
        const addUser = new userModel({
            email: email,
            password: hashPass,
            role: "Student"
        });
        const addstudent = new studentModel({
            name: name,
            rollno:rollno,
            department:department,
            userID: addUser.id 
        });
        await addUser.save();
        await addstudent.save();
        return res.redirect("/AdminDashboard");

    } catch (error) {
        console.log(`Error adding Student ${error.message}`);
    }
}



async function addsociety(req,res) {


       try {
    const {name,email,password } = req.body;
    
        const plainPass = password;
        const hashPass = await bcrypt.hash(plainPass,10);
        const addUser = new userModel({
            email: email,
            password: hashPass,
            role: "Society"
        });
        const addsociety = new societyModel({
            name: name,
            userID: addUser.id 
        });
        await addUser.save();
        await addsociety.save();
        return res.redirect("/AdminDashboard");

    } catch (error) {
        console.log(`Error adding Society ${error.message}`);
    }
}



async function stueditpage(req,res) {

    const userID = req.params.id;

console.log(userID)
    const student = await userModel.findById(userID);
    console.log(student._id)
const stu_info = await studentModel.findOne({userID: student._id}).populate("userID");

res.render('./Admin/editStudent',{stu_info})

}


async function societyeditpage(req,res) {
    
  const userID = req.params.id;
    const society = await userModel.findById(userID);
const soc_info = await societyModel.findOne({userID: society._id}).populate("userID");
console.log(soc_info.name)
    res.render('./Admin/editSociety',{soc_info})

}



async function delstudent(req,res) {
    
const stu_id = req.params.id;
const user = await userModel.findById(stu_id);
if (!user) return res.status(404).send("User not found");
const student = await studentModel.findOne({ userID: user._id });
if (student) {
    await studentModel.findByIdAndDelete(student._id);
}

await userModel.findByIdAndDelete(stu_id);

res.redirect("/AdminDashboard");

}


async function delsociety(req,res) {
    
const soc_id = req.params.id;
const user = await userModel.findById(soc_id);
if (!user) return res.status(404).send("Society not found");
const society = await societyModel.findOne({ userID: user._id });
if (society) {
    await societyModel.findByIdAndDelete(society._id);
}

await userModel.findByIdAndDelete(soc_id);

res.redirect("/AdminDashboard");

}


async function updatestudent(req,res) {

     try {
     const userID = req.params.id; 
    const { name, email, rollno, department, password } = req.body;
     const student = await studentModel.findById(userID);
   if (!student) return res.status(404).send("Student info not found");

    student.name = name;
    student.rollno = rollno;
    student.department = department;


   const user = await userModel.findOne({ _id: student.userID });
    if (!user) return res.status(404).send("User not found");

    user.email = email;
    if (password && password.trim() !== "") {
      const hashPass = await bcrypt.hash(password, 10);
      user.password = hashPass;
    }
      await user.save();
    await student.save();
        return res.redirect("/AdminDashboard");

  } catch (error) {
    console.error(`Error updating student: ${error.message}`);
    res.status(500).send("Server error");
  }

}



async function updatesociety(req,res) {

     try {
     const userID = req.params.id; 
    const { name, email, password } = req.body;
     const society = await societyModel.findById(userID);
   if (!society) return res.status(404).send("Society info not found");

    society.name = name;

   const user = await userModel.findOne({ _id: society.userID });
    if (!user) return res.status(404).send("User not found");

    user.email = email;
    if (password && password.trim() !== "") {
      const hashPass = await bcrypt.hash(password, 10);
      user.password = hashPass;
    }
      await user.save();
    await society.save();
        return res.redirect("/AdminDashboard");

  } catch (error) {
    console.error(`Error updating Society: ${error.message}`);
    res.status(500).send("Server error");
  }

}






export default {admindash,addstudentpage,addscocietypage,addstudent,
    addsociety,stueditpage,societyeditpage,delstudent,delsociety,updatestudent,updatesociety};