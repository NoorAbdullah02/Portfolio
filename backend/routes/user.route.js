import express from 'express';
import userValidationSchema from '../validationCheck/userValidationCheck.js';
import { db } from '../db/index.js';

import { registerAdmin, userSchema } from '../drizzle/schema.js';
import loginValidation from '../validationCheck/loginValidation.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

import tokenCheck from '../middleware/tokenCheck.js';

const router = express.Router();


router.post('/submit-contact', async (req, res) => {

    const validationCheck = await userValidationSchema.safeParseAsync(req.body);
    if (!validationCheck.success) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const { name, email, phone, message } = validationCheck.data;

    try {
        const [result] = await db.insert(userSchema).values({
            name, email, phone, message
        }).returning(
            { id: userSchema.id }
        );

        return res.status(201).json({
            message: 'Submitted successfully',
            ID: result.id
        })
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }

})



router.post('/register', async (req, res) => {
    const validCheck = await loginValidation.safeParseAsync(req.body);

    if (!validCheck.success) {
        return res.status(400).json({ error: 'Invalid login data' });
    }
    const existingAdmin = await db.select().from(registerAdmin);
    if (existingAdmin.length >= 1) {
        return res.status(400).json({
            error: 'Admin already registered'
        });
    }

    const { email, password } = validCheck.data;

    const hashPassword = await bcrypt.hash(password, 10);

    try {
        const [user] = await db.insert(registerAdmin)
            .values({
                email,
                password: hashPassword
            }).returning();

        return res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
})


router.post('/login', async (req, res) => {
    const validationCheck = await loginValidation.safeParseAsync(req.body);

    if (!validationCheck.success) {
        return res.status(400).json({ error: 'Invalid login data' });
    }
    try {

        const { email, password } = validationCheck.data;

        const [user] = await db.select().from(registerAdmin).where(eq(registerAdmin.email, email));

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const checkpassword = await bcrypt.compare(password, user.password);

        if (!checkpassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({
            email
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.cookie('token', token);
        return res.status(200).json({ message: 'Login successful', token });


    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/profile', tokenCheck, async (req, res) => {

    try {
        const allUsers = await db.select().from(userSchema);
        return res.status(200).json({ users: allUsers });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }

})



export default router;



