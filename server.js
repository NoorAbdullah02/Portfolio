const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// CORS configuration (adjust the origin as needed)
const corsOptions = {
    origin: 'http://127.0.0.1:5500',  // Change this if the frontend is on a different port
    methods: ['GET', 'POST'],
};
app.use(cors(corsOptions));

// MongoDB connection string
mongoose.connect('mongodb://localhost:27017/contactForm', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit the process if MongoDB is not connected
    });

// Contact form schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String
});

// Model for contact form
const Contact = mongoose.model('Contact', contactSchema);

// POST route to handle contact form submission
app.post('/submit-contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Check if the email or phone already exists in the database
        const existingContact = await Contact.findOne({
            $or: [{ email }, { phone }]  // Check for either email or phone
        });

        if (existingContact) {
            return res.status(400).json({
                status: 'error',
                message: 'This email or phone number is already in use. Please use a different one.'
            });
        }

        // Create new contact entry if email/phone are unique
        const newContact = new Contact({ name, email, phone, message });

        // Save to the database
        await newContact.save();

        // Send success response
        res.status(200).json({
            status: 'success',
            message: 'Form submitted successfully!'
        });
    } catch (error) {
        console.error("Error in /submit-contact route:", error);  // Log more detailed error
        res.status(500).json({
            status: 'error',
            message: 'An error occurred. Please try again.'
        });
    }
});

// Server setup
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
