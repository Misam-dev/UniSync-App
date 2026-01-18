import express from 'express';
const router = express.Router();
import admincontroller from "../Controller/adminController.js"


router.get('/AdminDashboard',admincontroller.admindash);
router.get('/addstudent',admincontroller.addstudentpage);
router.get('/addsociety',admincontroller.addscocietypage);
router.get('/editstudent/:id',admincontroller.stueditpage);
router.get('/editsociety/:id',admincontroller.societyeditpage)
router.get('/delstudent/:id',admincontroller.delstudent)
router.get('/delsociety/:id',admincontroller.delsociety)

router.post('/addstud',admincontroller.addstudent)
router.post('/addsocit',admincontroller.addsociety)
router.post('/updatestudent/:id',admincontroller.updatestudent)
router.post('/updatessociety/:id',admincontroller.updatesociety)




export default router;