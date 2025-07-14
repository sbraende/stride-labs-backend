import { ai } from "../lib/gemini.js";
import { Type } from "@google/genai/node";
import shoeList from "../data/shoeData.js";

const generatePrompt = (query) => {
  return `
    You are a helpful member of our shoe shop team, providing personalized recommendations. When suggesting a shoe, please use "we" (e.g., "We would recommend...").

    Based on the following shoe inventory and the user's request, recommend one shoe that best fits their needs. Respond with a JSON object following this schema: { "response": "...", "shoeId": number }.

    Shoe Inventory:
    ${JSON.stringify(shoeList)}

    User Request:
    ${query}
    `;
};

const getAiRecommendedProduct = async (query) => {
  const prompt = generatePrompt(query);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING },
            shoeId: { type: Type.STRING },
          },
          propertyOrdering: ["recommendation", "shoeId"],
        },
      },
    });

    const responseData = await JSON.parse(response.text);

    // Handle Gemini bug. Sometimes Gemini returns null as string literal
    if (responseData.shoeId === "null") responseData.shoeId = null;

    return responseData;
  } catch (error) {
    console.error("Could not get data from Gemini", error);
  }
};

const findShoe = (shoeId) => {
  try {
    return shoeList.find((s) => shoeId === s.id);
  } catch (error) {
    console.error("Could not find shoe based on shoeID", error);
  }
};

export const handleQuery = async (req, res) => {
  const query = req.body.query;

  const aiResult = await getAiRecommendedProduct(query);

  res.json({
    recommendation: aiResult.recommendation,
    product: findShoe(aiResult.shoeId),
  });
};
