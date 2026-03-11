import { GoogleGenAI } from "@google/genai";
// import ollama from "ollama";
import dotenv from "dotenv";
dotenv.config();
const api = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function main(FullContent) {
  const response = await api.models.generateContentStream({
    model: "gemini-2.5-flash-lite",
    contents: FullContent
  });

  return response;


  // const response = await ollama.chat({
  //   model: "phi3:latest",
  //   messages: [{ role: "user", content: FullContent }],
  //   stream: false,
  // })
  
  // console.log({content:response.message.content});
  // return response.message.content;
} 
export default main;