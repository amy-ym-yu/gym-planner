import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Looking for .env at:", path.join(__dirname, '.env'));
dotenv.config({ 
  path: path.join(__dirname, '.env'),
  debug: true 
});
dotenv.config({ 
  path: path.join(__dirname, '.env'),
  debug: true,
  override: true  // This forces dotenv to override existing env vars
});

console.log("=== DOTENV DEBUG ===");
console.log("Current working directory:", process.cwd());
console.log("__filename would be:", import.meta.url);
console.log("Total env vars loaded:", Object.keys(process.env).length);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("MISTRAL_API_KEY exists:", !!process.env.MISTRAL_API_KEY);
console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
console.log("===================");

import express from "express";
import cors from "cors";
import { Mistral } from "@mistralai/mistralai";
import OpenAI from "openai";
import emailRoutes from "./routes/email.js";
import geoapifyRoutes from "./routes/geoapify.js";

const app = express();

const mistral_client = new Mistral(process.env.MISTRAL_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://gym-planner-d100a.web.app",
    "https://gym-planner-brg0.onrender.com",
  ] 
 })); // adjust for prod
app.use(express.json({ limit: "200kb" }));

app.post("/api/openai", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages) {
      return res.status(400).json({ error: "Missing messages in body" });
    }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages,
        max_tokens: 2048,
        temperature: 0.1,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("OpenAI error:", data);
      return res.status(resp.status).json(data);
    }

    res.json(data); // just forward OpenAI response
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/mistral", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages) {
      return res.status(400).json({ error: "Missing messages in body" });
    }
    // console.log('Received messages for Mistral:', messages);
    const resp = await mistral_client.chat.complete({
        model: 'mistral-large-latest',
        temperature: 0.1,  
        maxTokens: 2048,
        topP: 1,
      messages: [
          ...messages
        ],
    });

    console.log('Mistral response data:', resp);
    res.json(resp); // just forward response
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.use("/api/email", emailRoutes);

app.use("/api/geoapify/autocomplete", geoapifyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Backend listening on http://localhost:${PORT}`)
);
