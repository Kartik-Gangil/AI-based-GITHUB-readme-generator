import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const api = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function main(FullContent) {
    const response = await api.models.generateContent({
        model: "gemini-2.0-flash",
      contents: FullContent
    });
    return response.text;
}
export default main;