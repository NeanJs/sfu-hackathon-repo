const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
console.log("Using Gemini API Key:", apiKey ? `...${apiKey.slice(-4)}` : "Not found"); // Log the key
const API_MODEL = "gemini-2.5-flash-preview-05-20";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=${apiKey}`;

interface GeminiTool {
  google_search?: {};
}

export async function callGeminiApi(
  prompt: string,
  systemInstruction?: string,
  tools?: GeminiTool[],
  responseSchema?: object
): Promise<string> {
  const maxRetries = 3;
  let delay = 1000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const requestBody: any = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {},
      };

      if (systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      if (tools) {
        requestBody.tools = tools;
        // If tools are used, we cannot request JSON mime type directly.
        // The model will be instructed in the prompt to output JSON-like text.
      } else if (responseSchema) {
        // Only request JSON mime type if no tools are used and a schema is provided.
        requestBody.generationConfig.response_mime_type = "application/json";
        requestBody.generationConfig.response_schema = responseSchema;
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `API request failed with status ${response.status}: ${errorBody}`
        );
      }

      const data = await response.json();
      let textResponse = data.candidates[0].content.parts[0].text;

      // Remove markdown code block delimiters if present
      if (textResponse.startsWith('```json')) {
        textResponse = textResponse.substring(7);
      }
      if (textResponse.endsWith('```')) {
        textResponse = textResponse.substring(0, textResponse.length - 3);
      }
      return textResponse.trim();
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) {
        throw new Error("API call failed after multiple retries.");
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  throw new Error("Exhausted all retries for API call.");
}
