import express from 'express'
import cors from 'cors'
import { connectDB } from '@config/db.config'
import 'dotenv/config'




// app config
const app = express()
const port = 4000

//middleware
// app.use(express.json())
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
// connectDB()

//api endpoints
// app.use('/api/auth', authRouter)


app.get('/', (req, res) => {
    res.send('Api Working')
})

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})