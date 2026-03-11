import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import getRepoFileStructure from './Github.js';
import main from './Gemini.js';
import fs from 'fs';
import path from 'path';
import process from 'node:process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import authMiddleware from "./middleware/authMiddleware.js"
import rateLimit from "express-rate-limit";
import connectToServer from './DB/Connection.js';
import User from './DB/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests
    message: "Too many requests from this IP, please try again later."
});




const PORT = process.env.PORT || 8000;
const redirectURL = process.env.redirectURL || 'http://localhost:5173/main';

const app = express();
app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",
    "https://readmeup.creovateio.in"
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like Postman or mobile apps)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(cookieParser())


connectToServer()


app.get('/', (req, res) => {
    return res.send("Working")
})






app.post('/', authMiddleware, limiter, async (req, res) => {
    const { url, branch } = req.body;
    const githubToken = req.user.githubAccessToken;
    // console.log({ githubToken })
    // console.log({ url, branch });
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    try {
        // const { flag, content } = await Generate_Readme(url, branch, githubToken);

        // if (flag) {
        //     res.status(200).json({ message: 'File written successfully', repo: (url.split('/').pop()).replace(/\.git$/, ''), content });
        // }
        // else {
        //     res.status(500).json({ error: 'Error writing file' });
        // }


        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");

        await Generate_Readme(url, branch, githubToken, res);

        res.end();


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

// auth api

app.get("/auth-check", (req, res) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            authenticated: false
        });
    }

    res.json({
        authenticated: true
    });
});


app.get('/auth/github', (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID;

    const redirectUrl =
        `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user&redirect_uri=http://localhost:8000/auth/github/callback`

    res.redirect(redirectUrl)
})


app.get("/auth/github/callback", async (req, res) => {

    const code = req.query.code;

    const response = await axios.post("https://github.com/login/oauth/access_token", {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
    }, {
        headers: {
            Accept: "application/json"
        }
    })

    const accessToken = response.data.access_token;
    // console.log(accessToken)
    // get user data

    const user = await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    const githubUser = user.data;


    //  mongodb user cred saving
    const existingUser = await User.findOne({ Github_Uname: githubUser.login });

    if (existingUser) {
        console.log("User already exists!");
    }
    else {
        const newUser = await User.create({
            Id: githubUser.id,
            Photo: githubUser.avatar_url,
            name: githubUser.name,
            Github_Uname: githubUser.login,
            Email: githubUser.email
        });
    }



    const token = jwt.sign(
        {
            id: githubUser.id,
            username: githubUser.login,
            avatar: githubUser.avatar_url,
            githubAccessToken: accessToken
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 3600000
    })

    res.redirect(redirectURL)
})



app.listen(PORT, () => {
    console.log("app listen on port " + PORT);
})






// getRepoInfo('https://github.com/Kartikgupta666/AI-agent.git')

function appendContent(CONTENT) {
    let content = `You are an expert open-source documentation writer.

Generate a professional README.md.

Rules:
- Output ONLY README.md
- No explanations
- Use GitHub markdown

FILES:
${CONTENT}
`;
    return content;
}



async function Generate_Readme(url, branch, accessToken, res) {
    try {
        let flag = false;
        const { Content, repo } = await getRepoFileStructure(url, branch, accessToken);
        const FullContent = appendContent(Content);
        const data = await main(FullContent); // resolve the Promise


        for await (const chunk of data) {

            if (chunk.text) {
                res.write(chunk.text);   // send to client
            }

        }

        // const outputDir = path.join(__dirname, 'output');
        // if (!fs.existsSync(outputDir)) {
        //     fs.mkdirSync(outputDir);
        // }
        // const filePath = path.join(outputDir, `${repo}.md`);
        // fs.writeFileSync(filePath, data);

        // console.log('File written successfully');
        // flag = true;
        // return { flag, content };
        // res.status(200).json({message:'file written succesfully' , repo})
    } catch (err) {
        console.error('Error writing file:', err);
    }
}