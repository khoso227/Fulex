import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const analyzeVehicleHealth = async (mileageLogs: any[]) => {
  const prompt = `Analyze these vehicle mileage logs and provide a health status. 
  Logs: ${JSON.stringify(mileageLogs)}
  Return a JSON object with:
  - healthScore (0-100)
  - statusMessage (e.g. "Excellent", "Urgent tuning needed")
  - recommendations (array of strings)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthScore: { type: Type.NUMBER },
            statusMessage: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["healthScore", "statusMessage", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Health Error:", error);
    return null;
  }
};

export const predictFuelNeeds = async (history: any[]) => {
  const prompt = `Based on this fueling history, predict when the user will need to refuel next and estimated cost.
  History: ${JSON.stringify(history)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedDays: { type: Type.NUMBER },
            estimatedCost: { type: Type.NUMBER },
            advice: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    return null;
  }
};
