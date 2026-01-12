
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeWiki = async (wikiText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Resuma o seguinte texto de uma wiki de cliente de agência de forma concisa e profissional:\n\n${wikiText}`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini summary error:", error);
    return "Falha ao gerar resumo da AI.";
  }
};

export const suggestTasks = async (clientName: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Com base nas informações do cliente ${clientName}: "${description}", sugira 3 tarefas de marketing/agência importantes.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              priority: { type: Type.STRING }
            },
            required: ["title", "description", "priority"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini task suggestion error:", error);
    return [];
  }
};

export const chatWithAssistant = async (message: string, history: any[], context: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `Você é o AgencyOS AI, um assistente inteligente especializado em gestão de agências. 
        Você ajuda a equipe com tarefas, planejamento estratégico, redação e organização.
        Contexto atual do workspace: ${context}
        Responda sempre em Português do Brasil, de forma profissional, útil e concisa, como se estivesse no Notion.`
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Assistant chat error:", error);
    return "Desculpe, tive um problema ao processar sua solicitação. Pode tentar novamente?";
  }
};
