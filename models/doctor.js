const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const doctorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    doctorId : {
        type:String,
        required:true,
        unique:true,
    },
    specialization: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique:true,
        required:true,
    },
    phoneNo: {
        type: String,
        required:true,
    },
    gender:{
        type: String,
        required:true,
    },
    age:{
        type:Number,
        required:true,
    },
    password: {
        type: String,
        required: true,
    },
    address:{
        type:String,
        required:true,
    }
})

doctorSchema.pre('save' , async function(next){
    const doctor = this
    if(!doctor.isModified('password')) return next();
    
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(doctor.password , salt);
        doctor.password = hashedPassword
        next();

    }catch(err){
        return next(err)
    }
})

doctorSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare( candidatePassword , this.password )
        return isMatch

    }catch(err){
        throw err;
    }
}


const Doctor = mongoose.model("Doctor" , doctorSchema)
module.exports = Doctor