import express from 'express';
import userRoutes from './routes/user.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(express.json());

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    return res.json({
        message: "App is On"
    })
})

app.use(userRoutes)


app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});