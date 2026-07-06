const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Fayllarni saqlash uchun 'uploads' papkasini ochish
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Multer orqali fayl nomini saqlash sozlamasi
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// Ma'lumotlar ombori (Database simulyatsiyasi)
let database = {
    stollar: Array(300).fill(false)
};

// 1. SA-MP va tashqi saytlar uchun ma'lumotlarni FETCH qilish (Baza formati)
app.get('/api/db-fetch', (req, res) => {
    res.json({
        host: "castle-host.com",
        db_user: "shadows",
        db_pass: "shadows1209",
        server_status: "ONLINE",
        total_slots: 300,
        current_data: database.stollar
    });
});

// 2. Xavfsiz Login API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'shadows' && password === 'shadows1209') {
        res.json({ success: true, token: "secure_token_shadows_2026" });
    } else {
        res.status(401).json({ success: false, error: "Noto'g'ri login yoki parol" });
    }
});

// 3. Stollar holatini olish
app.get('/api/stollar', (req, res) => {
    res.json({ stollar: database.stollar });
});

// 4. Buyruq qabul qilish (Faqat xavfsiz token bilan)
app.post('/api/buyruq', (req, res) => {
    const { stolRaqami, holat, token } = req.body;
    if (token !== "secure_token_shadows_2026") {
        return res.status(403).json({ success: false, error: "Ruxsat yo'q" });
    }
    if (stolRaqami >= 1 && stolRaqami <= 300) {
        database.stollar[stolRaqami - 1] = holat;
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Xato slot raqami" });
    }
});

// 5. Barchasini tozalash API
app.post('/api/clear-all', (req, res) => {
    const { token } = req.body;
    if (token === "secure_token_shadows_2026") {
        database.stollar = Array(300).fill(false);
        res.json({ success: true });
    } else {
        res.status(403).json({ success: false });
    }
});

// 6. Serverga fayl yuklash API
app.post('/api/upload', upload.single('serverFile'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, error: "Fayl yo'q" });
    res.json({
        success: true,
        name: req.file.filename,
        size: req.file.size
    });
});

// Asosiy ko'rinish (index.html) faylini yuklash
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`CastlePanel server ${PORT}-portda faol...`);
});
