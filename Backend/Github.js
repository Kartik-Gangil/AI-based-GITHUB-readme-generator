import { Octokit } from '@octokit/rest'
import path from 'path'

function createOctokit(token) {
    return new Octokit({
        auth: token,
        userAgent: 'octokit/rest.js v1.2.3'
    })
}

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
    "JavaScript": [
        "package.json",
        "index.js",
        "main.js",
        "app.js",
        "server.js",
        ".babelrc",
        ".eslintrc",
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
        ".env.staging",
        ".env.sample",
        ".env.example",
        "Dockerfile",
        ".dockerignore",
        "docker-compose.yml",
        "docker-compose.override.yml"
    ],
    "TypeScript": [
        "package.json",
        "tsconfig.json",
        "index.ts",
        "main.ts",
        "app.ts",
        ".eslintrc",
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
        ".env.staging",
        ".env.sample",
        ".env.example",
        "Dockerfile",
        ".dockerignore",
        "docker-compose.yml",
        "docker-compose.override.yml"
    ],
    "Python": [
        "script.py",
        "main.py",
        "app.py",
        "server.py",
        "requirements.txt",
        "requirement.txt",
        "pyproject.toml",
        "project.toml",
        "Pipfile",
        "setup.py",
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
        ".env.staging",
        ".env.sample",
        ".env.example",
        "Dockerfile",
        ".dockerignore",
        "docker-compose.yml",
        "docker-compose.override.yml"
    ],
    "Java": [
        "Main.java",
        "App.java",
        "pom.xml",
        "build.gradle",
        "settings.gradle",
        ".classpath",
        ".project",
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
        ".env.staging",
        ".env.sample",
        ".env.example",
        "Dockerfile",
        ".dockerignore",
        "docker-compose.yml",
        "docker-compose.override.yml"
    ],
    "C++": [
        "main.cpp",
        "app.cpp",
        "program.cpp",
        "CMakeLists.txt",
        "Makefile",
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
        ".env.staging",
        ".env.sample",
        ".env.example",
        "Dockerfile",
        ".dockerignore",
        "docker-compose.yml",
        "docker-compose.override.yml"
    ],
    "C": [
        "main.c",
        "program.c",
        "Makefile",
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
        ".env.staging",
        ".env.sample",
        ".env.example",
        "Dockerfile",
        ".dockerignore",
        "docker-compose.yml",
        "docker-compose.override.yml"
    ],
    "Go": [
        "main.go",
        "app.go",
        "go.mod",
        "go.sum",
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
        ".env.staging",
        ".env.sample",
        ".env.example",
        "Dockerfile",
        ".dockerignore",
        "docker-compose.yml",
        "docker-compose.override.yml"
    ],
    "Ruby": [
        "main.rb",
        "app.rb",
        "Gemfile",
        "Gemfile.lock",
        "Rakefile",
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
        ".env.staging",
        ".env.sample",
        ".env.example",
        "Dockerfile",
        ".dockerignore",
        "docker-compose.yml",
        "docker-compose.override.yml"
    ],
    "PHP": [
        "index.php",
        "app.php",
        "composer.json",
        "composer.lock",
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
        ".env.staging",
        ".env.sample",
        ".env.example",
        "Dockerfile",
        ".dockerignore",
        "docker-compose.yml",
        "docker-compose.override.yml"
    ],
    "Rust": [
        "main.rs",
        "lib.rs",
        "Cargo.toml",
        "Cargo.lock",
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
        ".env.staging",
        ".env.sample",
        ".env.example",
        "Dockerfile",
        ".dockerignore",
        "docker-compose.yml",
        "docker-compose.override.yml"
    ],
    "Kotlin": [
        "Main.kt",
        "App.kt",
        "build.gradle.kts",
        "settings.gradle.kts",
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
        ".env.staging",
        ".env.sample",
        ".env.example",
        "Dockerfile",
        ".dockerignore",
        "docker-compose.yml",
        "docker-compose.override.yml"
    ],
    "Swift": [
        "main.swift",
        "App.swift",
        "Package.swift",
        "*.xcodeproj",
        "*.xcworkspace",
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
        ".env.staging",
        ".env.sample",
        ".env.example",
        "Dockerfile",
        ".dockerignore",
        "docker-compose.yml",
        "docker-compose.override.yml"
    ],
    "R": [
        "main.R",
        "app.R",
        "DESCRIPTION",
        ".Rproj",
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
        ".env.staging",
        ".env.sample",
        ".env.example",
        "Dockerfile",
        ".dockerignore",
        "docker-compose.yml",
        "docker-compose.override.yml"
    ]
};


// file parser

const fileParsers = {

  "package.json": (content, path) => {
    const pkg = JSON.parse(content);
    return {
      path,
      type: "node-project",
      dependencies: Object.keys(pkg.dependencies || {}),
      devDependencies: Object.keys(pkg.devDependencies || {}),
      scripts: Object.keys(pkg.scripts || {})
    };
  },

  "tsconfig.json": (content, path) => {
    const config = JSON.parse(content);
    return {
      path,
      type: "typescript-config",
      target: config.compilerOptions?.target,
      module: config.compilerOptions?.module
    };
  },

  "requirements.txt": (content, path) => ({
    path,
    type: "python-dependencies",
    dependencies: content
      .split("\n")
      .map(d => d.trim())
      .filter(Boolean)
  }),

  "requirement.txt": (content, path) => ({
    path,
    type: "python-dependencies",
    dependencies: content
      .split("\n")
      .map(d => d.trim())
      .filter(Boolean)
  }),

  "go.mod": (content, path) => ({
    path,
    type: "go-module",
    dependencies: content
      .split("\n")
      .filter(line => line.startsWith("require"))
  }),

  "composer.json": (content, path) => {
    const comp = JSON.parse(content);
    return {
      path,
      type: "php-project",
      dependencies: Object.keys(comp.require || {})
    };
  },

  "Dockerfile": (content, path) => ({
    path,
    type: "dockerfile",
    baseImage: content.split("\n")[0].replace("FROM", "").trim()
  }),

  "pom.xml": (content, path) => ({
    path,
    type: "maven-project",
    summary: "Java Maven project detected"
  }),

  "build.gradle": (content, path) => ({
    path,
    type: "gradle-project",
    summary: "Java/Kotlin Gradle build configuration"
  }),

  "build.gradle.kts": (content, path) => ({
    path,
    type: "gradle-project",
    summary: "Java/Kotlin Gradle build configuration"
  })
};



async function getFile(owner, repo, path, oK) {
    try {
        const response = await oK.repos.getContent({
            owner,
            repo,
            path: path
        })
        const content = Buffer.from(response.data.content, "base64").toString("utf-8");

        return content;

    } catch (error) {
        console.error(error)
    }
}

function optimizeFiles(files) {

  return files.map(file => {

    const { path, content } = file.value || file;
    const base = path.split("/").pop();

    try {

      if (fileParsers[base]) {
        return fileParsers[base](content, path);
      }

      if (base.includes("docker-compose")) {
        return {
          path,
          type: "docker-compose",
          summary: "Docker services configuration detected"
        };
      }

      return {
        path,
        type: "source-file"
      };

    } catch {
      return {
        path,
        type: "unknown",
        error: "Failed to parse file"
      };
    }

  });
}


//  fetch the highest contribute language from the git repositry
async function getRepoLanguageList(url, oK) {
    try {
        const { owner, repo } = parseURL(url);
        const response = await oK.repos.listLanguages({
            owner,
            repo,
        });

        const content = response.data;
        console.log({ languageFunction: response })
        const Language = Object.keys(content).reduce((a, b) => content[a] > content[b] ? a : b);

        return Language;
    } catch (error) {
        console.error("Error fetching repo info:", error.message);
    }
}

// this function fetch the content from the git repositry file
async function getRepoContent(url, paths, oK) {
    try {
        const { owner, repo } = parseURL(url);
        let Content = "";
        const file = await Promise.allSettled(
            paths.map(async (path) => {
                const content = await getFile(owner, repo, path, oK);
                return { path, content };
            })
        )
        console.log(file)
        console.log(optimizeFiles(file))

        
        Content += `project name: ${repo} \n`;
        Content += `${JSON.stringify(optimizeFiles(file), null, 2)}`

        console.log(Content)
        return { Content, repo };
    } catch (error) {
        console.error("Error fetching repo info:", error.message);
    }
}



// this function fetch the file structure from the git repository
async function getRepoFileStructure(url, branch, accessToken) {
    try {
        const oK = createOctokit(accessToken);
        const { owner, repo } = parseURL(url);

        // Run language detection and tree fetching in parallel
        const [Language, treeData] = await Promise.all([
            getRepoLanguageList(url, oK),
            oK.git.getTree({
                owner,
                repo,
                tree_sha: branch, // branch name works directly
                recursive: "1"
            })
        ]);

        const Path = [];

        // Normalize language only once
        const normalizedLang = Object.keys(Files).find(
            key => key.toLowerCase() === Language?.toLowerCase()
        );

        if (!normalizedLang) {
            console.log("No matching language config found");
            return { Content: "", repo };
        }

        const allowedFiles = new Set(Files[normalizedLang]);

        // Filter relevant files
        for (const item of treeData.data.tree) {
            if (item.type === "blob") {
                const base = path.basename(item.path);

                if (allowedFiles.has(base)) {
                    Path.push(item.path);
                }
            }
        }

        console.log("Detected files:", Path.length);

        const { Content } = await getRepoContent(url, Path, oK);

        return { Content, repo };

    } catch (error) {
        console.error("Error fetching file structure:", error.message);
    }
}

// async function run() {
//     await getRepoFileStructure("https://github.com/Kartikgupta666/AI-based-GITHUB-readme-generator.git");

// }

// run()




export default getRepoFileStructure;
