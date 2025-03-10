import express from 'express'
import cors from 'cors'
import { connectDB } from '@config/db.config'
import 'dotenv/config'
import authRouter from '@routes/auth.route';
import productRouter from '@routes/product.route'
import cookieParser from 'cookie-parser';
// import otpRouter from '@routes/otp.route';


// app config
const app = express()
const port = 4000

//middleware
app.use(express.json())
app.use(cookieParser());
// app.use(cors({
//     origin: (origin, callback) => {
//         const allowedOrigins = [
//             'http://localhost:5173',
//             'http://localhost:5174'
//         ];
//         if (allowedOrigins.includes(origin) || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true
// }));



//db connection
connectDB()

//api endpoints

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/product', productRouter)
// app.use('/api/v1/otp', otpRouter);
app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})