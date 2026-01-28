import { GoogleGenAI } from "@google/genai";
import { GEMINI_PROMPT } from "../constants";

// Ideally, this should be proxied through a backend to hide the key, 
// but for this client-side demo we access it directly if available.
const API_KEY = process.env.GEMINI_API_KEY || '';

export const generateTypingText = async (): Promise<string> => {
  if (!API_KEY) {
    console.warn("No Gemini API Key found. Using fallback text.");
    // Return mock text instead of rejecting
    return "The quick brown fox jumps over the lazy dog. This typing test evaluates your speed and accuracy across various difficulty levels.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: GEMINI_PROMPT,
    });
    
    return response.text || "Failed to generate text.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};