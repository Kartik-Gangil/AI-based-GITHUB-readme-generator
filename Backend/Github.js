const { Octokit } = require('@octokit/rest')
const path = require('path')
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




const Files = {
    "Javascript": ["package.json", "index.js", "app.js", "server.js", "main.js", ".babelrc", ".eslintrc" , ".env-sample"],
    "Typescript": ["index.ts", "main.ts", "app.ts", "tsconfig.json", "package.json"],
    "Python": ["script.py", "requirements.txt", "project.toml", "app.py", "main.py", "server.py", "pipfile"],
    "Java": ["Main.java", "App.javapom", ".xml(Maven)", "build.gradle(Gradle)", "pom.xml"],
    "C++": ["main.cpp", "app.cpp", "program.cpp", "CMakeLists.txt", "Makefile"],
    "C": ["main.c", "program.c", "Makefile"],
    "Go": ["main.go", "app.go", "go.mod", "go.sum"],
    "Ruby": ["main.rb", "app.rb", "Gemfile", "Rakefile"],
    "PHP": ["index.php", "app.php", "composer.json"],
    "Rust": ["main.rs", "lib.rs", "Cargo.toml"],
    "Kotlin": ["Main.kt", "App.kt", "build.gradle.kts", "settings.gradle.kts"],
    "Swift": ["main.swift", "App.swift", "Package.swift", ".xcodeproj", ".xcworkspace"],
    "R": ["main.R", "app.R", "DESCRIPTION"]

}


//  fetch the highest contribute language from the git repositry
async function getRepoLanguageList(url) {
    try {
        const { owner, repo } = parseURL(url);
        const response = await oK.repos.listLanguages({
            owner,
            repo,
        });

        const content = response.data;
        const Language = Object.keys(content).reduce((a, b) => content[a] > content[b] ? a : b);

        return Language;
    } catch (error) {
        console.error("Error fetching repo info:", error.message);
    }
}

// this function fetch the content from the git repositry file
async function getRepoContent(url, paths) {
    try {
        const { owner, repo } = parseURL(url);
        let Content = "";
        for (const path of paths) {
            const response = await oK.repos.getContent({
                owner,
                repo,
                path: path
            })

            const content = Buffer.from(response.data.content, 'base64').toString('utf8');
            Content += `project name: ${repo} \n`;
            Content += "\n\n\n----------------------- another file--------------------------------- \n\n\n";
            Content += content;
        }
        // console.log(Content)
        return { Content, repo };
    } catch (error) {
        console.error("Error fetching repo info:", error.message);
    }
}




//  this fuunction fetch the file structure from the git repositry
async function getRepoFileStructure(url) {
    try {
        let Path = [];
        const Language = await getRepoLanguageList(url)
        const { owner, repo } = parseURL(url);
        // Step 1: Get the SHA of the latest commit on the branch
        const refData = await oK.git.getRef({
            owner,
            repo,
            ref: `heads/main`
        });

        const commitSha = refData.data.object.sha;

        // Step 2: Get the tree SHA from the commit
        const commitData = await oK.git.getCommit({
            owner,
            repo,
            commit_sha: commitSha
        });

        const treeSha = commitData.data.tree.sha;

        // Step 3: Get the full recursive tree
        const treeData = await oK.git.getTree({
            owner,
            repo,
            tree_sha: treeSha,
            recursive: "1"
        });

        // Output file paths
        treeData.data.tree.forEach(item => {
            if (item.type === 'blob') {
                const base = path.basename(item.path);
                // Normalize the language key (e.g., "javascript" → "Javascript")
                const normalizedLang = Object.keys(Files).find(
                    key => key.toLowerCase() === Language.toLowerCase()
                );
                if (normalizedLang && Files[normalizedLang].includes(base)) {
                    Path.push(item.path)
                }
            }
        });
        console.log(Path)
        const { Content } = await getRepoContent(url, Path)
        return { Content, repo };
    } catch (error) {
        console.error("Error fetching file structure:", error.message);
    }
}


// async function run() {
//     await getRepoFileStructure("https://github.com/Kartikgupta666/AI-based-GITHUB-readme-generator.git");

// }

// run()




module.exports = getRepoFileStructure;
