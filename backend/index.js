import express from 'express';
import userRoutes from './routes/user.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(userRoutes)


app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});