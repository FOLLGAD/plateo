import {
    type Content,
    type GenerateContentRequest,
    VertexAI
} from "@google-cloud/vertexai";

export async function getGeminiResponse(messages: Content[], systemPrompt: string) {
    const vertex_ai = new VertexAI({
        project: "neostack-391613",
        location: "europe-west2",
    });
    const model = "gemini-1.5-pro-preview-0409";

    // Instantiate the models
    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: model,
        generationConfig: {
            maxOutputTokens: 8192,
            topP: 0.95,
            temperature: 0,
        },
        systemInstruction: {
            role: "system",
            parts: [{ text: systemPrompt }],
        },
    });

    async function generateContent() {
        const req: GenerateContentRequest = {
            // contents: [{ role: "user", parts: [{ text: `hey!` }] }],
            contents: messages,
        };

        const resp = await generativeModel.generateContent(req);

        return resp.response.candidates[0].content.parts[0].text;
    }

    return generateContent();
}
