import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL
const PORT = process.env.PORT || 3039
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const OTP_EXPIRY = parseInt(process.env.OTP_EXPIRY || '300', 10)
const EMAIL_SERVICE = process.env.EMAIL_SERVICE
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

export {
    MONGODB_URL,
    PORT,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    OTP_EXPIRY,
    EMAIL_SERVICE,
    EMAIL_PASSWORD
}