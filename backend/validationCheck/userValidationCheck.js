import z from 'zod';

const userValidationSchema = z.object({
    name: z.string().min(2).max(30),
    email: z.string().email(),
    phone: z.string().min(10).max(15),
    message: z.string().min(5).max(500),
});

export default userValidationSchema;