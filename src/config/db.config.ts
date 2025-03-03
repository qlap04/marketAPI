import mongoose from 'mongoose';
import { MONGODB_URL } from '@config/index.config';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
