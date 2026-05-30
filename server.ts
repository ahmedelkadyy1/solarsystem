import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize secure Gemini API with telemetry headers
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyATkTD_tH8l4a1VmGjxTuiBiz6fZQFFrKM";
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json());

// Main chat API for the AI Helper
app.post("/api/helper/chat", async (req, res) => {
  try {
    const { message, history, currentPlanet, currentLayer } = req.body;
    
    // Define the futuristic scifi assistant identity and environment context
    let systemInstruction = "You are the Cosmic Guidance Unit (CGU-35), an advanced holographic AI companion mapped directly into the Cosmic Layers Explorer HUD. Your mission is to provide accurate, engaging, and highly concise planetary/stellar science insights.\n\n";
    
    if (currentPlanet) {
      systemInstruction += `The pilot is currently focused on: ${currentPlanet}.\n`;
    }
    if (currentLayer) {
      systemInstruction += `The sensor is reporting data on the layer: ${currentLayer}.\n`;
    }
    
    systemInstruction += "\nKeep all scientific descriptions extremely brief, direct, and under three sentences so they fit clearly inside the pilot's scifi console overlay screen. Keep a steady, helpful, and mildly analytical robotic personality.";

    const contents: any[] = [];
    
    // Map client conversation history to Gemini SDK format
    if (history && Array.isArray(history)) {
      for (const item of history) {
        contents.push({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.text }]
        });
      }
    }
    
    // Add active query
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Helper Core Error:", error);
    res.status(500).json({ error: error.message || "Stellar translation transmission interrupted." });
  }
});

// Setup dynamic bundle routes
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production bundle built statically with recursive path detection
    let distPath = path.join(process.cwd(), 'dist');
    
    // Check if we are running in bundled output folder or from a subfolder
    const localCjsDir = typeof __dirname !== 'undefined' ? __dirname : '';
    if (localCjsDir && fs.existsSync(path.join(localCjsDir, 'index.html'))) {
      distPath = localCjsDir;
    } else if (fs.existsSync(path.join(process.cwd(), 'dist', 'index.html'))) {
      distPath = path.join(process.cwd(), 'dist');
    }
    
    console.log("Serving static files in production from:", distPath);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started successfully at http://0.0.0.0:${PORT}`);
  });
}

startServer();
