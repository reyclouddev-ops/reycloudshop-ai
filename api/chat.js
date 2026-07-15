import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });
    }

    try {

        const {
            text,
            prompt,
            model
        } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Pesan tidak boleh kosong."
            });
        }

        const response = await client.responses.create({

            model: model || "gpt-5",

            input: [
                {
                    role: "system",
                    content: prompt || "Kamu adalah AI Assistant."
                },
                {
                    role: "user",
                    content: text
                }
            ]

        });

        return res.status(200).json({

            success: true,

            result: response.output_text

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            error: err.message,

            detail: err.error || null

        });

    }

}
