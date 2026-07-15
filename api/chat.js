export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method tidak diizinkan"
        });
    }

    try {

        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Pesan kosong."
            });
        }

        const url = `https://api.lexcode.biz.id/api/ai/gpt/5.5?text=${encodeURIComponent(text)}`;

        const response = await fetch(url);
        const data = await response.json();

        return res.status(200).json({
            success: true,
            result: data.result
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            error: err.message
        });

    }

}
