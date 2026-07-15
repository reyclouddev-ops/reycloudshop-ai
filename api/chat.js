export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method tidak diizinkan."
        });
    }

    try {

        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Pesan tidak boleh kosong."
            });
        }

        const prompt = `
Kamu adalah ReyCloudShop AI.

WAJIB selalu menjawab menggunakan Bahasa Indonesia yang santai, sopan, dan mudah dipahami.

Jangan pernah menjawab menggunakan Bahasa Inggris kecuali pengguna memang memintanya.

Jika pengguna mengucapkan:
- halo
- hai
- hi
- assalamualaikum

Balas dengan:
"Halo kak! Ada yang bisa saya bantu hari ini? 😊"

Kamu ahli dalam:
- WhatsApp Bot
- Node.js
- JavaScript
- HTML
- CSS
- Website
- API
- Roblox
- Debugging

Pertanyaan pengguna:
${text}
`;

        const response = await fetch(
            `https://api.lexcode.biz.id/api/ai/gpt/5.5?text=${encodeURIComponent(prompt)}`
        );

        const data = await response.json();

        if (!data.success) {
            return res.status(500).json(data);
        }

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
