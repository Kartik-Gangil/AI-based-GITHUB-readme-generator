
import mongoose, { Schema } from "mongoose"

const User = new Schema({
    Id: {
        required: true,
        type: String,
        unique: true
    },
    Photo: String,
    Github_Uname: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    Email: {
        type: String
    },
    Created_at: {
        type: Date,
        default: Date.now
    }

})
export default mongoose.model('User', User);