import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());          // allow requests from your frontend
app.use(express.json());  // parse JSON bodies

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ result: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate text" });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
