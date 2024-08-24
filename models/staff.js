const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age:{
        type:Number,
        required:true,
    },
    email: {
        type: String,
        required:true,
        unique:true,
    },
    phoneNo: {
        type: String,
        required:true,
    },
    password: {
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required:true,
    },
    LoginAs: {
        type: String,
        enum: ["admin", "nurse", "receptionist", "other"],
        default: "nurse",
    },
    department: {
        type:String,
        enum:["nursing" , "accounting" , "helper" , "medication" , "HR"],
        default:"nursing"
    },
})

staffSchema.pre('save' , async function(next){
    const staff = this
    if(!staff.isModified('password')) return next();
    
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(staff.password , salt);
        staff.password = hashedPassword
        next();

    }catch(err){
        return next(err)
    }
})

staffSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare( candidatePassword , this.password )
        return isMatch

    }catch(err){
        throw err;
    }
}

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff