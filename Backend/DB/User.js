
import mongoose, {Schema}  from "mongoose"

const User = new Schema({
    Id: {
        required: true,
        type: String,
        unique: true
    },
    Photo: String,
    name: {
        required: true,
        type: String
    },
    Email: {
        required: true,
        type: String
    },
    Password: {
        required: true,
        type: String
    },
    mode: {
        type: String,
        required: true,
    },
    Limit: {
        type: Number,
        default: 2
    },
    Created_at: {
        type: Date,
        default: Date.now
    }

})
export default mongoose.model('User', User);