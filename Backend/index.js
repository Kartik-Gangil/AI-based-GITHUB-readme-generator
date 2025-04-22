const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('this is the backend server');
})

app.listen(PORT, () => {
    console.log("app listen on port " + PORT);
})