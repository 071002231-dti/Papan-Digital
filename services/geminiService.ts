import { GoogleGenAI } from "@google/genai";
import { LAB_INFO, DEFAULT_FLOW } from "../constants";
import { storageService } from "./storageService";

// Initialize Gemini with API Key from environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Use Pro model for Search Grounding capabilities if needed, but Flash is faster for general queries.
// However, for specific URL grounding, we ensure we use a model capable of tool use.
const MODEL_NAME = "gemini-2.5-flash";

export const askLabAssistant = async (userQuery: string): Promise<string> => {
  try {
    // Fetch current dynamic data to give context to the AI
    const activities = storageService.getActivities();
    const facilities = storageService.getFacilities();
    
    const context = `
      You are the intelligent virtual assistant for the "${LAB_INFO.name}".
      Your goal is to help students and visitors understand the lab's activities, facilities, and rules.
      
      CONTEXT DATA:
      - Lab Location: ${LAB_INFO.location}
      - Opening Hours: ${LAB_INFO.openHours}
      - Coordinator: ${LAB_INFO.coordinator}
      
      CURRENT ACTIVITIES:
      ${JSON.stringify(activities.map(a => `${a.title} on ${a.date} (${a.time}) - ${a.status}`))}
      
      FACILITIES STATUS:
      ${JSON.stringify(facilities.map(f => `${f.name}: ${f.status}`))}
      
      LAB USAGE FLOW (SOP):
      ${JSON.stringify(DEFAULT_FLOW.map(f => `${f.id}. ${f.title}: ${f.description}`))}
      
      INSTRUCTIONS:
      - Keep answers concise (under 50 words if possible) as this is a digital signage display.
      - Be professional, helpful, and futuristic in tone.
      - If asked about availability, use the Facilities Status data.
      - If asked about schedule, use Current Activities.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userQuery,
      config: {
        systemInstruction: context,
      }
    });

    return response.text || "Maaf, saya sedang mengalami gangguan koneksi. Silakan tanya asisten lab.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sistem AI sedang offline. Harap hubungi admin lab.";
  }
};

export const getDelSimUpdates = async (): Promise<string> => {
  try {
    const prompt = `
      Access and read the website https://industrial.uii.ac.id/laboratorium/delsim/.
      Provide a structured summary for a digital signage display containing:
      1. What is the DelSim Laboratory (Profile).
      2. What are the key research focus areas.
      3. Any recent news, announcements, or practicum info mentioned on the page.
      
      Format the output with clean Markdown headings (##) and bullet points. 
      Keep it engaging and informative for students.
      Use Bahasa Indonesia.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}], // Enable Grounding
      },
    });

    // Check for grounding chunks if needed, but .text usually contains the synthesized answer
    return response.text || "Gagal mengambil data dari website DelSim. Silakan cek koneksi internet.";
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return "Sedang tidak dapat terhubung ke website UII. Silakan pindai QR Code untuk info manual.";
  }
};