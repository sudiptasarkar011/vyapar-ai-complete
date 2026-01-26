// vyapar-ai-backend/check_models.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    // This fetches all available models for your specific API Key
    const models = await genAI.getGenerativeModel({ model: "gemini-pro" }).apiKey; 
    // Wait, the SDK doesn't expose listModels directly on the instance sometimes. 
    // Let's use the fetch approach which is fail-safe.
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    const data = await response.json();

    if (data.models) {
      console.log("\n✅ AVAILABLE MODELS (Copy one of these):");
      data.models.forEach(m => {
        if (m.name.includes("generateContent")) { // Only show models that can generate text
            console.log(`- ${m.name.replace("models/", "")}`);
        }
      });
    } else {
      console.log("❌ Error:", data);
    }
  } catch (error) {
    console.error("Failed to list models:", error);
  }
}

listModels();