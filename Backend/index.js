const express = require('express');
const cors = require('cors');
require('dotenv').config();
const getRepoInfo = require('./Github');


const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;


getRepoInfo('https://github.com/Kartikgupta666/AI-agent.git')



app.get('/', (req, res) => {
    res.send('this is the backend server');
})

app.listen(PORT, () => {
    console.log("app listen on port " + PORT);
})

