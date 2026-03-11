import mongoose from 'mongoose';
import { config } from 'dotenv'
config()

const connectToServer = () => {
    mongoose.connect(process.env.mongoDB_URL)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            console.error("Error connecting to MongoDB:", err);
        });
}
export default connectToServer