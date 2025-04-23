const { GoogleGenAI } = require("@google/genai");

const api = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function main() {
    const response = await api.models.generateContent({
        model: "gemini-2.0-flash",
        contents: ``,
    });
    return response.text;
}
module.exports = main;