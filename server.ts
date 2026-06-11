import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON body parser with a generous limit to support high-resolution photo uploads
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Shared Gemini Client Utility
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// API endpoint for analyzing skin photos using Gemini Vision API
app.post("/api/analyze", async (req, res) => {
  try {
    const { image } = req.body; // base64 encoded image string (e.g. "data:image/jpeg;base64,...")
    
    if (!image) {
      return res.status(400).json({ error: "No image content provided for analysis." });
    }

    const client = getGeminiClient();
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ 
        error: "SkinScan is currently in demonstration mode. Please configure your GEMINI_API_KEY to enable live AI photo analysis." 
      });
    }

    // Process base64 image representation
    // Base64 string format usually: "data:image/jpeg;base64,/9j/4AA..."
    const match = image.match(/^data:([^;]+);base64,(.+)$/);
    let mimeType = "image/jpeg";
    let base64Data = image;

    if (match) {
      mimeType = match[1];
      base64Data = match[2];
    }

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: `Analyze the provided close-up face photo for dermatological assessment purposes.
First, check if this is a valid skin photo or close-up facial photo. If the image is completely blurred, doesn't contain a human face, or has pitch-black or insufficient lighting, return a response with an assessment explaining the problem and empty lists for concerns and recommendations.

Otherwise, perform a thorough, compassionate, and helpful skincare analysis. Identify:
1. The user's apparent Skin Type (Oily, Dry, Combination, Normal, or Sensitive).
2. Up to 4 primary skin concerns (such as acne, redness, dark spots/hyperpigmentation, dry patches, or fine lines) with their estimated severity (Mild, Moderate, Severe), visual evidence, and an educational background.
3. Estimations of overall skin state score out of 100.
4. Clean and concrete active ingredients recommendations mapped to their concerns with retail search queries (like "salicylic acid cleanser AM/PM").
5. Clean, safe, kitchen-ready natural/DIY home remedies with clear ingredients lists, safety precautions (always including patch test guidance), and application guidelines.

Rules:
- Be encouraging, clinical yet welcoming, and polite. Avoid diagnostic medical claims (add or reflect in your assessment that this is educational guidance and not a replacement for medical diagnosis).
- Do not make up dangerous remedies. Stick to proven natural ingredients like Aloe Vera, green tea, cold cucumber compresses, oatmeal, honey, etc.
`
    };

    console.log("Calling Gemini Vision API with automatic retries & fallbacks...");

    // Unified helper implementing exponential backoff retry and flash fallback mechanisms
    const callModelWithFallback = async () => {
      const modelsToTry = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
      let lastError: any = null;

      for (let attempt = 0; attempt < modelsToTry.length; attempt++) {
        const modelName = modelsToTry[attempt];
        console.log(`[SkinScan AI] Attempting analysis using model: ${modelName} (Attempt ${attempt + 1}/${modelsToTry.length})`);
        
        try {
          const response = await client.models.generateContent({
            model: modelName,
            contents: { parts: [imagePart, textPart] },
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  skinType: {
                    type: Type.STRING,
                    description: "The primary skin type: Oily, Dry, Combination, Normal, or Sensitive"
                  },
                  overallScore: {
                    type: Type.INTEGER,
                    description: "Estimation of general skin barrier state or health score from 1 to 100."
                  },
                  assessment: {
                    type: Type.STRING,
                    description: "A empathetic and educational summary of current skin states. Add a small disclaimer that this is educational advice."
                  },
                  detectedConcerns: {
                    type: Type.ARRAY,
                    description: "Areas of visible concern found in the scanning.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        concern: {
                          type: Type.STRING,
                          description: "Skincare concern name (e.g., Acne, Redness, Hyperpigmentation, Fine Lines, Dryness)"
                        },
                        severity: {
                          type: Type.STRING,
                          description: "Severity rating: Mild, Moderate, or Severe"
                        },
                        visualEvidence: {
                          type: Type.STRING,
                          description: "Brief visual markers leading to this indication (e.g. 'slight congestion near T-zone')"
                        },
                        details: {
                          type: Type.STRING,
                          description: "Short educational guidance explaining the physiological cause of this concern."
                        }
                      },
                      required: ["concern", "severity", "visualEvidence", "details"]
                    }
                  },
                  commercialRecommendations: {
                    type: Type.ARRAY,
                    description: "Targeted ingredient/product classes optimal for these concerns.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: {
                          type: Type.STRING,
                          description: "Generic formulation or ingredient match (e.g., Salicylic Acid Cleanser, Hydrating Hyaluronic Serum)"
                        },
                        category: {
                          type: Type.STRING,
                          description: "Category: Cleanser, Serum, Moisturizer, Sunscreen, Toners, or Clay Mask"
                        },
                        activeIngredients: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: "Key active molecules (e.g. ['Salicylic Acid', 'Zinc PCA'])"
                        },
                        purpose: {
                          type: Type.STRING,
                          description: "Why these active ingredients target their detected concerns."
                        },
                        howToUse: {
                          type: Type.STRING,
                          description: "Usage instruction (when to apply, frequency, AM or PM, and what to wear it with like UV screen)"
                        },
                        searchQuery: {
                          type: Type.STRING,
                          description: "Optimized shopping search string to find this kind of product on Amazon/retailers"
                        }
                      },
                      required: ["name", "category", "activeIngredients", "purpose", "howToUse", "searchQuery"]
                    }
                  },
                  naturalRecommendations: {
                    type: Type.ARRAY,
                    description: "Safe, easy DIY home solutions that can support skin health alongside commercial care.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: {
                          type: Type.STRING,
                          description: "Descriptive name of the remedy (e.g., Soothing Cucumber & Green Tea Splash, Hydrating Honey & Oatmeal Mask)"
                        },
                        ingredients: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: "Kitchen staples list needed"
                        },
                        purpose: {
                          type: Type.STRING,
                          description: "How it provides soothing or clarifying action naturally."
                        },
                        instructions: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: "Step-by-step instructions for prep, application, time length, and washing."
                        },
                        precautions: {
                          type: Type.STRING,
                          description: "Patch test and allergy guidance or warnings (like avoiding sun after lemon/citrus)."
                        }
                      },
                      required: ["name", "ingredients", "purpose", "instructions", "precautions"]
                    }
                  }
                },
                required: ["skinType", "overallScore", "assessment", "detectedConcerns", "commercialRecommendations", "naturalRecommendations"]
              }
            }
          });
          return response; // Successful generation
        } catch (error: any) {
          lastError = error;
          const errorStr = (error.message || "").toLowerCase();
          const isRetryable = 
            errorStr.includes("demand") || 
            errorStr.includes("503") || 
            errorStr.includes("unavailable") || 
            errorStr.includes("exhausted") || 
            errorStr.includes("rate") || 
            errorStr.includes("limit") || 
            errorStr.includes("429");

          if (isRetryable && attempt < modelsToTry.length - 1) {
            const delay = Math.pow(2, attempt + 1) * 1000 + Math.random() * 500;
            console.warn(`[SkinScan AI] Model ${modelName} returned 503/Demand signal. Backing off ${Math.round(delay)}ms before fallback to next model...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            // Unrecoverable error or we exhausted all models
            break;
          }
        }
      }
      throw lastError || new Error("All active Gemini vision model attempts failed to respond.");
    };

    const response = await callModelWithFallback();
    const parsedResponse = JSON.parse(response.text || "{}");
    return res.json(parsedResponse);
  } catch (error: any) {
    console.error("Analysis Endpoint Error:", error);
    let friendlyMessage = error.message || "An unexpected error occurred during the skincare scan.";
    
    // Check for high-demand, 503, resource limits, or rate limit headers inside error payloads
    const errorStr = ((error.message || "") + " " + JSON.stringify(error)).toLowerCase();
    if (
      errorStr.includes("demand") || 
      errorStr.includes("503") || 
      errorStr.includes("unavailable") || 
      errorStr.includes("exhausted") || 
      errorStr.includes("rate") || 
      errorStr.includes("limit")
    ) {
      friendlyMessage = "The AI model is currently experiencing extremely high surge demand or temporary rate alignment limit. This is usually very brief! Please tap 'Retry Analysis' with your loaded photo below to try again.";
    }

    return res.status(500).json({ 
      error: friendlyMessage 
    });
  }
});

// Configure Vite integration for developer hot-reloading vs. production serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode. Serving pre-compiled static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SkinScan Server is running at http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Vite/Express Setup failed entirely:", err);
});
