// routes/geoapify.ts
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// GET /api/geoapify/autocomplete?text=Berlin
router.get("/", async (req, res) => {
  const { text } = req.query;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing 'text' query param" });
  }

  try {
    console.log("Fetching location suggestions for:", text);
    console.log(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      text
    )}&limit=5&apiKey=${process.env.GEOAPIFY_KEY}`)
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      text
    )}&limit=5&apiKey=${process.env.GEOAPIFY_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("Geoapify response data:", data);
    res.json(data);
  } catch (error) {
    console.error("Geoapify error:", error);
    res.status(500).json({ error: "Failed to fetch location suggestions" });
  }
});

export default router;
