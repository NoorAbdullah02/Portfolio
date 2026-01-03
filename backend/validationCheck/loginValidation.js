import z from "zod";

const loginValidation = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
})

export default loginValidation;