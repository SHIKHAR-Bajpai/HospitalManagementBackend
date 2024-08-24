const express = require('express')
const DB = require('./db/db')
const app = express()
require('dotenv').config();

DB()

const bodyParser = require('body-parser')
app.use(bodyParser.json());   //req.body

// Importing Routes
const doctorRoutes = require('./routes/doctorRoutes')
const staffRoutes = require('./routes/staffRoutes')
const userRoutes = require('./routes/userRoutes')
// const appointmentRoutes = require('./middleware/appointmentRoutes')

// Using routes
app.use('/doctor' , doctorRoutes )
app.use('/staff' , staffRoutes )
app.use('/user' , userRoutes )
// app.use('/appointment' , appointmentRoutes)


const PORT = process.env.PORT || 4000
app.listen(PORT , () => {
    console.log(`Listening on port:${PORT}`)
})