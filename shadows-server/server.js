const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 300 ta stol ma'lumotlari (barchasi boshida bo'sh - false)
let stollar = Array(300).fill(false);

// Saytning asosiy dizaynini (index.html) ekranga chiqarish
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API: Stollar holatini olish
app.get('/api/stollar', (req, res) => {
    res.json({ stollar: stollar });
});

// API: Do'stingiz saytdan bosganda buyruq qabul qilish
app.post('/api/buyruq', (req, res) => {
    const { stolRaqami, holat } = req.body;
    if (stolRaqami >= 1 && stolRaqami <= 300) {
        stollar[stolRaqami - 1] = holat;
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Xato stol raqami" });
    }
});

app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda faol ishlamoqda...`);
});
