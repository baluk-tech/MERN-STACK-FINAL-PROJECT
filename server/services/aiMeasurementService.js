const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==========================================
// 1. AI MEASUREMENT GENERATOR (FAST VERSION)
// ==========================================
const aiGeneratedMeasurement = async (imageUri) => {
  try {
    // 🚨 Speed-kaga 'gemini-flash-lite-latest' & maxOutputTokens set pannirukkom 🚨
    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-lite-latest",
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
            maxOutputTokens: 400, // Thevayillama perusa generate pannaama thadukkum
        }
    });

    const base64Data = imageUri.split(",")[1];
    const mimeType = imageUri.substring(imageUri.indexOf(":") + 1, imageUri.indexOf(";"));

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

   const prompt = `You are an expert master tailor AI. Analyze the person's photo very carefully. 
    Calculate their actual, realistic body measurements in inches (and height in cm) based on their specific visual height, weight, and build. 
    Do NOT just copy template numbers. Every person is different, so estimate proportional values.
    
    You MUST return ONLY a valid JSON object matching this exact structure with estimated numbers:
    {
      "shirt": { "neck": 15, "shoulder": 18, "chest": 40, "waist": 34, "hip": 38, "sleeveLength": 24, "armhole": 20, "bicep": 14, "wrist": 7, "shirtLength": 28 },
      "pant": { "waist": 34, "hip": 40, "thigh": 24, "knee": 16, "bottom": 14, "inseam": 30, "outseam": 40, "rise": 10, "pantLength": 40, "ankle": 12 },
      "height": 175,
      "addNotes": "AI estimation based on the person's visual build."
    }`;

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();

    return { choices: [{ message: { content: text } }] };
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
};

// ==========================================
// 2. AI CHATBOT SERVICE (FAST DIRECT CALL)
// ==========================================
const aiChatService = async (messageHistory) => {
  try {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-lite-latest",
        generationConfig: {
            maxOutputTokens: 200, // Short & fast reply-kaga
            temperature: 0.7,
        }
    });

    const userQuestion = messageHistory[messageHistory.length - 1].content;

    // startChat-ku bathila direct prompt anuppina double speed-la varum
    const prompt = `You are a virtual tailoring stylist for StitchAI. Answer the user's fashion, fabric, or tailoring question politely in 2-3 short sentences with emojis.
    User Question: ${userQuestion}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw new Error("Failed to get AI chat response");
  }
};

module.exports = { aiGeneratedMeasurement, aiChatService };