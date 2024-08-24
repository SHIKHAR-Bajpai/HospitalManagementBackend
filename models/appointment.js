const mongoose = require("mongoose");
const Doctor = require("./doctor");

const appointmentSchema = new mongoose.Schema({
    doctor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', 
        required: true 
    },
    doctorName:{
        type:String,
        required:true,
    },
    doctorId: {
        type: String,
        required: true,
    },
    patient: {
        type: String,
        required: true,
    },
    appointmentDate: {
        type: String,
        required: true,
    },
    time:{
        type: String,
        default: "",
    },
    email:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["scheduled", "inProgress", "completed", "cancelled"],
        default: "scheduled",
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;