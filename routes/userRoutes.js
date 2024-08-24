const express = require("express");
const router = express.Router();

const User = require('../models/user')
const { jwtAuthMiddleware, generateToken } = require('../middleware/jwtToken')

const Appointment = require("../models/appointment")
const appointmentRoutes = require('../middleware/appointmentRoutes')

// signup Route --> add new user
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;

        const existingUser = await User.findOne({ email: data.email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" })
        }

        const newUser = new User(data)
        const savedUser = await newUser.save()
        const response = {
            Name: savedUser.name,
            Age: savedUser.age,
            Gender: savedUser.gender,
            email: savedUser.email,
            PhoneNo: savedUser.phoneNo,
            Address: savedUser.address
        };
        const payload = { id: savedUser._id }
        const token = generateToken(payload)
        // console.log("Token: ", token)

        res.status(200).json({ message: 'User saved successfully', response, token })

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server error' });
    }
});

// login route --> existing user
router.post('/login', async ( req , res ) => {
    try{
        const {email , password}= req.body
        const newUser = await User.findOne({email: email})

        if(!newUser || !(await newUser.comparePassword(password))){
            return res.status(401).json({error:'Invalid username or password'})
        }

        const payload = {
            id : newUser.id,
        }
        const token = generateToken(payload)
        res.status(200).json({ message:"Log in Successfull", token: token });

    }catch(err){
        console.log(err)
        res.status(500).json({error : 'Internal Server Error '})
    }
})

// view user profile by user
router.get('/profile' , jwtAuthMiddleware , async (req , res) => {
    try{
        const userId = req.user.id
        const user = await User.findById(userId)

        res.status(200).json({user})
    }
    catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server Error "})
    }
})

// updating user details
router.put('/profile/update', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id
        if (!userId) {
            return res.status(401).json({ error: 'Invalid Token' })
        }
        const updatedData = req.body
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        user.set(updatedData)
        const response = await user.save()
        res.status(200).json({ message: 'Data Updated Successfully' , response : response});

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server error' });
    }
})

// delete user data
router.delete('/profile/delete', jwtAuthMiddleware , async(req,res) => {
    try{
        const userId = req.user.id
        const response = await User.findByIdAndDelete(userId)

        if(!response){
            return res.status(404).json({error : "User Not Found !!"})
        }
        res.status(200).json({message:"User deleted successfully "})
    }catch(err){
        console.log(err)
        res.status(500).json({error : 'Internal Server Error '})
    }
})

// Appointment routes to create a new appointment and view appointment
router.use('/appointments' , jwtAuthMiddleware , appointmentRoutes)


module.exports = router