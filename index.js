const express = require("express");
const axios = require("axios");
const Tesseract = require("tesseract.js");

const app = express();
const PORT = 3000;

// Endpoint OCR dari URL
app.get("/ocr", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ status: 400, message: "URL gambar diperlukan!" });
    }

    try {
        // Ambil gambar dari URL sebagai buffer
        const response = await axios.get(url, { responseType: "arraybuffer" });
        const imageBuffer = Buffer.from(response.data, "binary");

        // Proses OCR dengan Tesseract.js
        const { data: { text } } = await Tesseract.recognize(imageBuffer, "eng");

        // Bersihkan hasil OCR dari newline dan spasi berlebih
        const cleanedText = text.replace(/\s+/g, " ").trim();

        res.json({ status: 200, message: "OCR berhasil", result: cleanedText });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Terjadi kesalahan", error: error.message });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
