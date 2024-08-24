const express = require("express");
const router = express.Router();

const Staff = require('../models/staff')
const { jwtAuthMiddleware, generateToken } = require('../middleware/jwtToken')
const isAdmin = require("../middleware/checkAdmin");

// signup Route --> add new staff member by admin
router.post('/signup' , jwtAuthMiddleware , async (req , res) =>{
    try{
        const data = req.body 
        if(data.LoginAs === "admin"){
            const existing_admin = await Staff.find({LoginAs:"admin"})
            if(existing_admin.length > 0){
                res.status(402).json({message : "Admin already exist"})
                return
            }
        }
        const newStaff = new Staff(data)
        const response = await newStaff.save()

        const payload = {
            id:response.id,
        } 
        const token = generateToken(payload)
        res.status(200).json({ message: 'Staff member data saved successfully', response ,  token: token})

    }catch(err){
        console.log("Error saving data " , err);
        res.status(500).json({error:'Internal Server error'});
    }
})

// login route --> existing user
router.post('/login', async ( req , res ) => {
    try{
        const {email , password}= req.body
        const newUser = await Staff.findOne({email: email})

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

// updating staff details by admin
router.put('/update/:staffId', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!isAdmin(req.user.id)) {
            return res.status(401).json({ message: "Required admin role" })
        }
        const staffId = req.params.staffId
        if (!staffId) {
            return res.status(400).json({ error: 'Invalid StaffId' })
        }
        const updatedData = req.body
        const staff = await Staff.findById(staffId)
        if (!staff) {
            return res.status(404).json({ error: 'Staff member not found' })
        }
        staff.set(updatedData)
        const response = await staff.save()

        res.status(200).json({ message: 'Data Updated Successfully' , response : response})

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server error' })
    }
})

// delete staff data by admin
router.delete('/delete/:staffId' , jwtAuthMiddleware , async(req,res) => {
    try{
        if(!isAdmin(req.user.id)){
            res.status(404).json({message : "Admin Role Required"})
            return
        }
        const staffId = req.params.staffId
        const response = await Staff.findByIdAndDelete(staffId)

        if(!response){
            return res.status(404).json({error : "Staff member Not Found !!"})
        }
        res.status(200).json({message:"Staff member deleted successfully "})
    }catch(err){
        console.log(err)
        res.status(500).json({error : 'Internal Server Error '})
    }
})

module.exports = router