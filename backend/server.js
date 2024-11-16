const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/authRoutes');
const cors = require('cors')
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors())

mongoose.connect(process.env.MONGODB_URI).then(()=> {
    console.log("Database connected")
});

app.use("/api/auth", authRoutes);

app.listen(process.env.port, () => {
    console.log(`Server running on port ${process.env.port}`)
})
