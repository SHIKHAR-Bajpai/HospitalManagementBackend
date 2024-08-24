const express = require('express')
const router = express.Router()

const Appointment = require('../models/appointment')
const Doctor = require('../models/doctor')

// create new appointment
router.post('/new', async (req, res) => {
    try {
        const { doctorName, doctorId, patient, appointmentDate, time, email, phone} = req.body

        if (!doctorName || !doctorId || !patient || !appointmentDate || !email || !phone) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const doctor = await Doctor.findOne({ doctorId })
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' })
        }

        const newAppointment = new Appointment({
            doctor: doctor._id,  
            doctorName : doctorName,
            doctorId: doctor.doctorId, 
            patient,
            appointmentDate,
            time,
            email,
            phone,
        })

        const savedAppointment = await newAppointment.save()
        res.status(200).json(savedAppointment)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' })
    }
})


// get appointment by email for user
router.get("/view/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const appointments = await Appointment.find({ email })
        if (appointments.length === 0) {
            res.json({ message: 'No Appointments found' })
            return
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
        }));
        res.status(200).json(response)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error:"Internal Server Error" })
    }
})

module.exports = router;
