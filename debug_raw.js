// debug_raw.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function debugModels() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
      console.log("❌ NO API KEY FOUND in .env");
      return;
  }
  console.log(`🔑 Using Key ending in: ...${key.slice(-5)}`);

  try {
    // Direct fetch to bypass SDK logic
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
    );
    
    const data = await response.json();

    if (data.error) {
        console.log("\n❌ API ERROR:");
        console.log(JSON.stringify(data.error, null, 2));
    } else {
        console.log("\n✅ RAW RESPONSE (First 5 models):");
        console.log(JSON.stringify(data.models ? data.models.slice(0, 5) : data, null, 2));
    }
  } catch (error) {
    console.error("\n❌ NETWORK ERROR:", error);
  }
}

debugModels();