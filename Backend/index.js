const express = require('express');
const cors = require('cors');
require('dotenv').config();
const getRepoFileStructure = require('./Github');
const main = require('./Gemini');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;


// getRepoInfo('https://github.com/Kartikgupta666/AI-agent.git')

function appendContent(CONTENT) {
    let content = `create an interactive readme.md file by analyzing the data which i give to you and please do not include Key improvements and explanations section in readme file.The data is as follows "${CONTENT}" `;
    return content;
}



async function Generate_Readme(url) {
    try {
        const { Content, repo } = await getRepoFileStructure(url)
        const FullContent = appendContent(Content);
        const data = await main(FullContent); // resolve the Promise

        let content = data.split('```markdown')[1]
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        const filePath = path.join(outputDir, `${repo}.md`);
        fs.writeFileSync(filePath, content);

        console.log('File written successfully');
        // res.status(200).json({message:'file written succesfully' , repo})
    } catch (err) {
        console.error('Error writing file:', err);
    }
}


app.post('/', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    try {
        await Generate_Readme(url);
    }
    catch (e) {
        res.status(500).json({ error: 'Error generating readme ' + e.message });
    }
})

app.get('/getReadme', async (req, res) => {
    try {
        const { repo } = req.body;
        const filePath = path.join(__dirname, 'output', `${repo}.md`);
        res.setHeader('Content-Type', 'text/markdown');
        res.setHeader('Content-Disposition', `attachment; filename=${repo}.md`);
        res.download(filePath, `${repo}.md`, (err) => {
            if (err) {
                console.error("Download error:", err);
                res.status(500).send("Error downloading the file.");
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error generating readme' + error.message });

    }
})



app.listen(PORT, () => {
    console.log("app listen on port " + PORT);
})

