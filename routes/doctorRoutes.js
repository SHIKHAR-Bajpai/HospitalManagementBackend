const express = require("express");
const router = express.Router();

const Doctor = require('../models/doctor')
const Appointment = require("../models/appointment");
const { jwtAuthMiddleware} = require('../middleware/jwtToken');
const isAdmin = require("../middleware/checkAdmin");

// get list of all doctors 
router.get("/list/doctors", async (req, res) => {
    try {
        const doctors = await Doctor.find()
        
        const response = doctors.map(doctor => ({
            "Name": doctor.name,
            "ID": doctor.doctorId,
            "specialization": doctor.specialization,
            "email": doctor.email,
            "Phone No": doctor.phoneNo,
        }))
        res.status(200).json(response)

    } catch (error) {
        res.status(500).json({error:'Internal Server error'})
    }
})

// add new doctor 
router.post('/add-doctor' , jwtAuthMiddleware , async (req , res) =>{
    try{
        if( !isAdmin(req.user.id) ){
            return res.status(404).json({message : "Require admin role"})
        }
        const data = req.body 
        const doctorId = data.doctorId

        const check_existing = await Doctor.find({doctorId})
        if(!check_existing){
            res.status(400).json({ error: "Doctor already exists" })
            return
        }

        const newDoctor = new Doctor(data)
        const savedDoctor = await newDoctor.save()

        const response = {
            Name: savedDoctor.name,
            DoctorId: savedDoctor.doctorId,
            Specialization: savedDoctor.specialization,
            Gender: savedDoctor.gender,
            Age: savedDoctor.age,
            email: savedDoctor.email,
            PhoneNo: savedDoctor.phoneNo,
            Address: savedDoctor.address
        }
        res.status(200).json({ message: 'Doctor added successfully', response })

    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server error'})
    }
})

//  updating doctors profile info by admins
router.put('/update/:doctorId', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!isAdmin(req.user.id)) {
            return res.status(401).json({ message: "Required admin role" })
        }
        const doctorId = req.params.doctorId
        if (!doctorId) {
            return res.status(400).json({ error: 'Invalid DoctorId' })
        }
        const updatedData = req.body
        const doctor = await Doctor.findById(doctorId)
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' })
        }
        doctor.set(updatedData)
        const response = await doctor.save()

        res.status(200).json({ message: 'Data Updated Successfully'})

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server error' })
    }
})

// delete doctor 
router.delete('/delete/:doctorId' , jwtAuthMiddleware , async(req,res) => {
    try{
        if(!isAdmin(req.user.id)){
            res.status(404).json({message : "Admin Role Required"})
            return
        }
        const doctorId = req.params.doctorId
        const response = await Doctor.findByIdAndDelete(doctorId)

        if(!response){
            return res.status(404).json({error : "Doctor Not Found !!"})
        }
        res.status(200).json({message:"Doctor deleted successfully "})
    }catch(err){
        console.log(err)
        res.status(500).json({error : 'Internal Server Error '})
    }
})

// get appointments by doctorId
router.get("/appointments/:id", jwtAuthMiddleware , async (req, res) => {
    try{
        const doctorId = req.params.id
        const appointments = await Appointment.find({ doctorId })
        if(appointments.length === 0){
            return res.json({ message: "No appointments found" })
        }
        const response = appointments.map(appointment => ({
            ID: appointment._id,
            Doctor: appointment.doctorName,
            Patient: appointment.patient,
            AppointmentDate: appointment.appointmentDate,
            Time: appointment.time,
            email: appointment.email,
            Phone: appointment.phone,
            Status: appointment.status,
        }))
        res.status(200).json(response)    
    }catch(error){
        res.status(500).json({ error: "Internal Server Error "})
    }
})

// delete appointment by doctor 
router.delete("/appointment/delete/:appointmentId" , jwtAuthMiddleware , async(req,res) =>{
    try{
        const appointmentId = req.params.appointmentId
        const response = await Appointment.findByIdAndDelete(appointmentId)

        if(!response){
            req.status(404).json( { error: "Appointment not Found"})
        }
        res.status(500).json({message : "Appointment Deleted successfully !!"})

    }catch(err){
        res.status(500).json({ error: "Internal Server Error "})
    }

})


module.exports = router;