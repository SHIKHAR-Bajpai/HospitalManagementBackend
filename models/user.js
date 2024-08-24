const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    age:{
        type:Number,
        required:true,
    },
    email: {
        type: String,
        unique:true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required:true,
    },
    gender: {
        type: String,
        required:true
    },
    address: {
        type:String,
    }
});


userSchema.pre('save' , async function(next){
    const user = this
    if(!user.isModified('password')) return next();
    
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user.password , salt);
        user.password = hashedPassword
        next();

    }catch(err){
        return next(err)
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare( candidatePassword , this.password )
        return isMatch

    }catch(err){
        throw err;
    }
}


const User = mongoose.model("User", userSchema);
module.exports = User;