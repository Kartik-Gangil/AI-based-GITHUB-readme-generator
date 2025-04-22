const { Octokit } = require('@octokit/rest')

const oK = new Octokit({
    auth: process.env.GITHUB_TOKEN,
    userAgent: 'octokit/rest.js v1.2.3',
});

function parseURL(url) {
    try {
        const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/;
        const match = url.match(regex);
        if (match) {
            const owner = match[1];
            const repo = match[2].replace(/\.git$/, '');//remove .git if present
            return { owner, repo };
        }
    }
    catch (err) {
        console.error("Error parsing URL:", err.message);
    }
}



async function getRepoInfo(url) {
    try {
        const { owner, repo } = parseURL(url);
        const response = await oK.repos.getContent({
            owner,
            repo,
            path: "package.json",
        });
        // console.log(response.data);
        const content = Buffer.from(response.data.content, 'base64').toString('utf8');
        console.log(content);
    } catch (error) {
        console.error("Error fetching repo info:", error.message);
    }
}
module.exports = getRepoInfo;