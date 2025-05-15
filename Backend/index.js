import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import getRepoFileStructure from './Github.js';
import main from './Gemini.js';
import fs from 'fs';
import path from 'path';
import cluster from 'cluster';
import os from 'node:os';
import process from 'node:process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const numCPUs = os.availableParallelism();


const PORT = process.env.PORT || 8000;


if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`)
    // fork workers

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => console.log(`worker ${worker.process.pid} died`))

}
else {

    const app = express();
    app.use(express.json());
    app.use(cors());




    app.get('/', (req, res) => {
        res.send("Working")
    })






    app.post('/', async (req, res) => {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        try {
            const data = await Generate_Readme(url);
            if (data) {
                res.status(200).json({ message: 'File written successfully', repo: (url.split('/').pop()).replace(/\.git$/, '') });
            }
            else {
                res.status(500).json({ error: 'Error writing file' });
            }
        }
        catch (e) {
            res.status(500).json({ error: 'Error generating readme ' + e.message });
        }
    })

    app.post('/getReadme', async (req, res) => {
        try {
            const { repo } = req.body;
            const filePath = path.join(__dirname, 'output', `${repo}.md`);
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'File not found' });
            }
            res.setHeader('Content-Type', 'text/markdown');
            res.setHeader('Content-Disposition', `attachment; filename=${repo}.md`);
            res.download(filePath, `${repo}.md`, (err) => {
                if (err) {
                    console.error("Download error:", err);
                    return res.status(500).send("Error downloading the file.");
                }
                fs.unlinkSync(filePath); // Delete the file after download
            });
        } catch (error) {
            res.status(500).json({ error: 'Error generating readme' + error.message });

        }
    })



    app.listen(PORT, () => {
        console.log("app listen on port " + PORT);
    })

    // console.log(`Worker ${process.pid} started`)

}




// getRepoInfo('https://github.com/Kartikgupta666/AI-agent.git')

function appendContent(CONTENT) {
    let content = `create an interactive readme.md file by analyzing the data which i give to you and please do not include Key improvements and explanations section in readme file.The data is as follows "${CONTENT}" `;
    return content;
}



async function Generate_Readme(url) {
    try {
        let flag = false;
        const { Content, repo } = await getRepoFileStructure(url)
        const FullContent = appendContent(Content);
        const data = await main(FullContent); // resolve the Promise

        let content = data.split('```markdown')[1]
        if (!content) {
            throw new Error("Could not extract markdown content");
        }
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        const filePath = path.join(outputDir, `${repo}.md`);
        fs.writeFileSync(filePath, content);

        console.log('File written successfully');
        flag = true;
        return flag;
        // res.status(200).json({message:'file written succesfully' , repo})
    } catch (err) {
        console.error('Error writing file:', err);
    }
}

