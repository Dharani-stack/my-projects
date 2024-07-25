import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbLink : string = process.env.DB_URL as string;

export const connectDB = async () => {
    try {
        await mongoose.connect(dbLink, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions);

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); 
    }
};

