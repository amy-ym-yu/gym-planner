import { Mistral } from '@mistralai/mistralai';
// import OpenAI from "openai";
import system_prompt from "./prompt.txt"

const mistral_key = import.meta.env.VITE_MISTRAL_API_KEY as string;
const mistral_client = new Mistral({ apiKey: mistral_key });

// const openai_key = import.meta.env.VITE_OPEN_AI_API_KEY as string;
// const openai_client = new OpenAI({ apiKey: openai_key });

const temp = {
    "fitnessLevel": "(exercising 2-4x / week)",
    "currentFitness": [
        50
    ],
    "biologicalSex": "",
    "height": "",
    "weight": "",
    "activities": [
        "Hiking",
        "Kayaking",
        "Crossfit"
    ],
    "goals": [
        "Lose weight or body fat",
        "Improve confidence or self-esteem",
        "Develop functional strength (eg. carrying heavy groceries/luggage/boxes, walking uphill/stairs easier)"
    ],
    "planPreference": "guidance-accountability",
    "varietyImportance": [
        50
    ],
    "interestedActivities": [
        "Body Weight Exercises",
        "Kettlebell / Dumbbell Exercises",
        "Cycling",
        "Walking"
    ],
    "avoidActivities": [
        "Crossfit",
        "Circuit Training",
        "Standup Paddleboarding",
        "Trail Running",
        "Skiing / Snowboarding"
    ],
    "workoutFrequency": [
        3
    ],
    "workoutDays": [
        "Tuesday",
        "Saturday",
        "Sunday"
    ],
    "workoutDuration": "30-60 minutes",
    "considerWeather": "yes",
    "workoutPartner": "Alone",
    "workoutTime": "Afternoon (2-6 PM)",
    "additionalConsiderations": "",
    "weather": {
        "Sunday": {
            "type": "Overcast",
            "temperature": {
                "min": 69.1,
                "max": 104.3
            },
            "humidity": 51
        },
        "Tuesday": {
            "type": "Clear",
            "temperature": {
                "min": 78,
                "max": 109.8
            },
            "humidity": 30
        },
        "Saturday": {
            "type": "Overcast",
            "temperature": {
                "min": 59.2,
                "max": 91
            },
            "humidity": 79
        }
    }
};

export const getResponseFromLLM = async (client: string, prompt: string) => {
    if (client === 'mistral') {
        const response = await mistral_client.chat.complete({
            model: 'mistral-large-latest',
            temperature: 0.1,  
            maxTokens: 2048,
            topP: 1,
            messages: [
                {
                role: 'system',
                    content: JSON.stringify(system_prompt),
                },
                {
                role: 'user',
                content: JSON.stringify(temp),
                },
            ],
        });
        return response.choices[0].message.content;
    } else if (client === 'openai') {
        const response = await openai_client.responses.create({
            model: "gpt-4.1-mini",
            input: [
                {
                "role": "system",
                "content": [
                    {
                    "type": "input_text",
                    "text": system_prompt,
                    }
                ]
                },
                {
                "role": "user",
                "content": [
                    {
                    "type": "input_text",
                    "text": temp,
                    }
                ]
                },
            ],
            text: {
                "format": {
                "type": "text"
                }
            },
            reasoning: {},
            tools: [],
            temperature: 0.1,
            max_output_tokens: 2048,
            top_p: 1,
            store: true,
            include: ["web_search_call.action.sources"]
        });
        console.log('OpenAI Full Response:', response); // Log the full response for debugging
        return response.choices[0].message.text;
    }  else {
        throw new Error(`Unsupported LLM client: ${client}`);
    }
}
