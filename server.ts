import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // AI Intelligence Layer Endpoint
  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || "You are FuelX AI, a specialized intelligence layer for fuel station management."
        }
      });

      res.json({ response: response.text });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Predictions Endpoint
  app.post("/api/ai/predict", async (req, res) => {
    try {
      const { data } = req.body;
      const prompt = `Analyze this station state and provide strategic insights: ${JSON.stringify(data)}. 
      Focus on stock replenishment timing, price optimization, and efficiency alerts. 
      Return structured JSON only.`;

      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (error: any) {
      console.error("Prediction Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Intelligence Server running on http://localhost:${PORT}`);
  });
}

startServer();
