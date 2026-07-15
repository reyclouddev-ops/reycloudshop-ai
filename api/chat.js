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

        const pesan = text.trim();

        // Balasan otomatis untuk salam
        const salam = [
            "halo",
            "hallo",
            "hai",
            "hi",
            "hy",
            "assalamualaikum",
            "assalamu'alaikum",
            "p"
        ];

        if (salam.includes(pesan.toLowerCase())) {
            return res.status(200).json({
                success: true,
                result: "Halo kak! Ada yang bisa saya bantu hari ini? 😊"
            });
        }

        const prompt = `
Kamu adalah ReyCloudShop AI.

Selalu gunakan Bahasa Indonesia.

Jangan pernah mengawali jawaban dengan salam seperti:
"Halo", "Hai", "Halo kak", atau sejenisnya.

Langsung jawab inti pertanyaan pengguna.

Gunakan bahasa yang santai, ramah, dan mudah dipahami.

Keahlianmu:
- HTML
- CSS
- JavaScript
- Node.js
- WhatsApp Bot
- API
- Roblox
- Website
- Debugging

Pertanyaan pengguna:
${pesan}
`;

        const response = await fetch(
            `https://api.lexcode.biz.id/api/ai/gpt/5.5?text=${encodeURIComponent(prompt)}`
        );

        const data = await response.json();

        if (!data.success) {
            return res.status(500).json({
                success: false,
                error: data.error || "API Error"
            });
        }

        let hasil = data.result || "Maaf, saya tidak dapat memberikan jawaban.";

        // Hapus salam kalau AI masih mengirimnya
        hasil = hasil.replace(/^halo.*?\n*/i, "");
        hasil = hasil.replace(/^hai.*?\n*/i, "");
        hasil = hasil.replace(/^hi.*?\n*/i, "");

        return res.status(200).json({
            success: true,
            result: hasil.trim()
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            error: err.message
        });

    }

}
