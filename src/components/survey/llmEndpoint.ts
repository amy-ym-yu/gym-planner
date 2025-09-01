import system_prompt from "./prompt.txt?raw"

export const getResponseFromLLM = async (prompt: string) => {
    const sendRequest = async (url: string, body: any) => {
        const fullUrl = import.meta.env.VITE_BACKEND_URL + url;
        console.log("Sending request to:", fullUrl);
        const res = await fetch(fullUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        console.log(`${fullUrl} response status:`, res.status);
        console.log(`${fullUrl} response data:`, data);
        return data;
    };

    try {
        const body = {
            messages: [
                { role: "system", content: system_prompt },
                { role: "user", content: JSON.stringify(prompt) }
            ]
        };

        const data = await sendRequest("/api/openai", body);
        return data.choices[0]?.message?.content;
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        // Optionally, fallback to Mistral if needed

        console.log("Falling back to Mistral...");
        try {
            const body = {
                messages: [
                    { role: "system", content: system_prompt },
                    { role: "system", content: [{ type: "text", text: JSON.stringify(prompt) }] }
                ]
            };

            const data = await sendRequest("/api/mistral", body);
            return data.choices[0]?.message?.content;
        } catch (err) {
            console.error("Error communicating with Mistral:", err);
        }
    }
};
