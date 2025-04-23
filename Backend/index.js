const express = require('express');
const cors = require('cors');
require('dotenv').config();
const getRepoInfo = require('./Github');
const main = require('./Gemini');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;


// getRepoInfo('https://github.com/Kartikgupta666/AI-agent.git')



async function run() {
    try {
        const content = await main(); // resolve the Promise
        let Content = content.split('```markdown')[1]
        fs.writeFileSync('readme.md', Content);
        console.log('File written successfully');
    } catch (err) {
        console.error('Error writing file:', err);
    }
}

run();


app.get('/', (req, res) => {
    res.send('this is the backend server');
})

app.listen(PORT, () => {
    console.log("app listen on port " + PORT);
})

