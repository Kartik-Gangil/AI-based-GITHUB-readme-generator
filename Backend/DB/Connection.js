const mongoose = require('mongoose')

const connectToServer = () => {
    mongoose.connect(process.env.mongoDB_URL)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            console.error("Error connecting to MongoDB:", err);
        });
}
module.exports = connectToServer