import { GoogleGenAI } from "@google/genai";
import { LAB_INFO, DEFAULT_FLOW } from "../constants";
import { storageService } from "./storageService";

// Initialize Gemini with API Key from environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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