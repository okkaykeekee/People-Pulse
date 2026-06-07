const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });
console.log("cwd:", process.cwd());
console.log("dotenv path:", path.join(__dirname, ".env"));
console.log("GEMINI_API_KEY loaded:", Boolean(process.env.GEMINI_API_KEY));
console.log("GOOGLE_API_KEY loaded:", Boolean(process.env.GOOGLE_API_KEY));

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "HRMS Backend Running" });
});

app.post("/analyze-resume", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Please provide resume text."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    console.log("API key present inside route:", Boolean(apiKey));
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY or GOOGLE_API_KEY must be configured in environment." });
    }

    console.log("Resume text length:", text.trim().length);

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze this resume and provide:\n1. Score out of 10\n2. Skills identified\n3. Recommendation (Hire / Reject / Shortlist)\n\nResume:\n${text}`;

    const modelsToTry = ["models/gemini-2.5-flash", "models/gemini-1.5-flash"];
    let response;
    let lastError;

    for (const model of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        break;
      } catch (modelError) {
        lastError = modelError;
        const errorCode = modelError?.response?.status || modelError?.status;
        const errorMessage = modelError?.message || '';

        console.warn(`Model ${model} failed:`, errorCode, errorMessage);

        if (errorCode !== 503 && !errorMessage.includes('UNAVAILABLE')) {
          throw modelError;
        }
      }
    }

    if (!response) {
      throw lastError || new Error('Unable to generate resume analysis at this time.');
    }

    const output = response.text;
    res.json({ output });

  } catch (err) {
    console.error("========= ERROR =========");
    console.error(err);
    console.error(err?.message);
    console.error(err?.response ? JSON.stringify(err.response, null, 2) : "no response data");
    console.error("=========================");

    const message = err?.response?.data?.error || err?.message || "An unexpected error occurred while analyzing the resume.";
    return res.status(500).json({
      error: message
    });
  }
});

app.post("/generate-questions", async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !role.trim()) {
      return res.status(400).json({ error: "Please provide a job role." });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    console.log("API key present inside generate-questions route:", Boolean(apiKey));
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY or GOOGLE_API_KEY must be configured in environment." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate interview questions for the role: ${role}.\n\nProvide:\n1. 5 Technical Questions\n2. 3 Scenario-Based Questions\n3. 2 HR Questions\n\nReturn plain text grouped with headings for each category exactly like:\nTechnical Questions:\nScenario-Based Questions:\nHR Questions:\n\nDo not use markdown formatting; use numbered questions under each heading.`;

    const response = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: prompt,
    });

    const output = response.text;
    res.json({ output });
  } catch (err) {
    console.error("========= ERROR =========");
    console.error(err);
    console.error(err?.message);
    console.error(err?.response ? JSON.stringify(err.response, null, 2) : "no response data");
    console.error("=========================");

    const message = err?.response?.error?.message || err.message || "An unexpected error occurred while generating interview questions.";
    return res.status(500).json({ error: message });
  }
});

app.post("/generate-feedback", async (req, res) => {
  try {
    const { achievements } = req.body;

    if (!achievements || !achievements.trim()) {
      return res.status(400).json({ error: "Please provide employee achievements." });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    console.log("API key present inside generate-feedback route:", Boolean(apiKey));
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY or GOOGLE_API_KEY must be configured in environment." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate performance feedback based on the achievements below. Include:\n1. Overall performance summary\n2. Key strengths\n3. Areas for improvement\n4. Final performance rating\n\nAchievements:\n${achievements}`;

    const response = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: prompt,
    });

    const output = response.text;
    res.json({ output });
  } catch (err) {
    console.error("========= ERROR =========");
    console.error(err);
    console.error(err?.message);
    console.error(err?.response ? JSON.stringify(err.response, null, 2) : "no response data");
    console.error("=========================");

    const message = err?.response?.error?.message || err.message || "An unexpected error occurred while generating performance feedback.";
    return res.status(500).json({ error: message });
  }
});

app.post("/candidate-recommendation", async (req, res) => {
  try {
    const { name, resume } = req.body;

    if (!name || !name.trim() || !resume || !resume.trim()) {
      return res.status(400).json({ error: "Please provide candidate name and resume text." });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    console.log("API key present inside candidate-recommendation route:", Boolean(apiKey));
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY or GOOGLE_API_KEY must be configured in environment." });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate a candidate recommendation for ${name} based on this resume. Include:\n1. Overall candidate summary\n2. Strengths\n3. Weaknesses\n4. Recommended role\n5. Final decision:\n   - Hire\n   - Shortlist\n   - Reject\n\nResume:\n${resume}`;

    const response = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: prompt,
    });

    const output = response.text;
    res.json({ output });
  } catch (err) {
    console.error("========= ERROR =========");
    console.error(err);
    console.error(err?.message);
    console.error(err?.response ? JSON.stringify(err.response, null, 2) : "no response data");
    console.error("=========================");

    const message = err?.response?.error?.message || err.message || "An unexpected error occurred while generating candidate recommendation.";
    return res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port 5000");
});
