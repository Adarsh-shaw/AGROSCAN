
import { GoogleGenAI, Type } from "@google/genai";
import { PlantAnalysisResult } from "./types";

// Implementing Gemini 2.0 Flash as the multimodal brain for instant diagnosis
const MODEL_NAME = "gemini-2.0-flash";

export const analyzePlantImage = async (
  base64Image: string, 
  location?: { lat: number, lng: number },
  targetLanguage: string = "English"
): Promise<PlantAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const locationContext = location 
    ? `LOCATION DATA (Firebase/Maps Sync): Lat ${location.lat}, Lng ${location.lng}.` 
    : "GPS OFFLINE: Using general regional agronomic data.";

  const prompt = `ACT AS A SENIOR FULL STACK AGRONOMIST (10+ YEARS EXPERIENCE).
  STAGING: Google AI Studio Environment.
  MISSION: Multimodal diagnosis of pests, fungi, and nutrient issues using Gemini 2.0 Flash.

  DIAGNOSIS PROTOCOL:
  1. Identify plant species and specific pathology (Pest/Fungi/Nutrient).
  2. ${locationContext}
  3. Assess risk to neighbors (Firebase Real-time Sync).
  4. Design treatment using sustainable local materials (Cure Library).
  5. TRANSLATION: Provide a summary in ${targetLanguage} for local accessibility.

  FORMAT: Structured JSON Report.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          plantName: { type: Type.STRING },
          diseaseName: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
          description: { type: Type.STRING },
          biologicalCause: { type: Type.STRING },
          environmentalTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
          treatmentPlan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.STRING },
                description: { type: Type.STRING },
                materials: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["step", "description", "materials"]
            }
          },
          neighborRiskLevel: { type: Type.STRING },
          riskReasoning: { type: Type.STRING },
          preventionStrategies: { type: Type.ARRAY, items: { type: Type.STRING } },
          translation: {
            type: Type.OBJECT,
            properties: {
              language: { type: Type.STRING },
              advice: { type: Type.STRING }
            }
          }
        },
        required: [
          "plantName", "diseaseName", "confidenceScore", "description", 
          "biologicalCause", "environmentalTriggers", "treatmentPlan", 
          "neighborRiskLevel", "riskReasoning", "preventionStrategies"
        ]
      }
    }
  });

  try {
    const text = (response.text || "").trim();
    const parsed = JSON.parse(text);
    return {
      ...parsed,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      location
    };
  } catch (error) {
    console.error("Diagnosis Error:", error);
    throw new Error("Edge AI analysis failed. Ensure clear lighting and retake photo.");
  }
};
