require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Models
const Event = require('./models/Event');
const User = require('./models/User');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'saepe_super_secret_key_2025';

// Middleware
app.use(cors());
app.use(express.json());

// --- AUTH MIDDLEWARE (SECURITY CORE) ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <TOKEN>"

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({ message: "Access Denied: Invalid Token" });
        }
        // Success: Attach the decoded payload (id, role) to the request
        req.user = decodedUser;
        next();
    });
};

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Seed Initial Data
        await seedData();
        await seedAdmin();
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

// --- SEEDING LOGIC ---
const seedAdmin = async () => {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
        // Create Default Admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            password: hashedPassword,
            role: 'admin' // Explicitly set Admin role
        });
        console.log('Admin Account Created (user: admin, pass: admin123)');
    }
};

const seedData = async () => {
    try {
        const count = await Event.countDocuments();
        if (count === 0) {
            console.log('Database empty. Seeding events...');
            const events = [
                // 5 NEWS
                { title: "День Збройних Сил України", description: "Урочисте шикування. Форма одягу: парадна.", type: "Новина", date: new Date('2025-12-06T10:00:00'), isTopNews: true, image: "https://placehold.co/600x400/blue/white?text=Day+of+Armed+Forces" },
                { title: "Змагання з кросфіту", description: "Міжфакультетські змагання 'Сталева Воля'.", type: "Спорт", date: new Date('2025-11-30T14:00:00'), isTopNews: true, image: "https://placehold.co/600x400/red/white?text=Crossfit" },
                { title: "Зустріч з ветеранами", description: "Лекція на тему: 'Сучасна війна дронів'.", type: "Подія", date: new Date('2025-11-28T16:00:00'), isTopNews: true, image: "https://placehold.co/600x400/green/white?text=Veterans" },
                { title: "Благодійний ярмарок", description: "Збір коштів на FPV-дрони.", type: "Волонтерство", date: new Date('2025-12-10T09:00:00'), isTopNews: false },
                { title: "Оновлення навчальних планів", description: "До уваги 4-го курсу: оновлено питання до іспитів.", type: "Оголошення", date: new Date('2025-11-26T09:00:00'), isTopNews: false },
                // 10 SCHEDULE
                { title: "Ранкова фізична зарядка", description: "Пробіжка 3 км. Форма №2.", type: "Розклад", date: new Date('2025-11-27T06:30:00'), isTopNews: false },
                { title: "Лекція: Тактична медицина", description: "Протокол MARCH. Аудиторія 101.", type: "Навчання", date: new Date('2025-11-27T08:30:00'), isTopNews: false },
                { title: "Вогнева підготовка", description: "Виїзд на полігон. Стрільба з АК-74.", type: "Полігон", date: new Date('2025-11-28T09:00:00'), isTopNews: false },
                { title: "Семінар: OSINT-розвідка", description: "Пошук інформації у відкритих джерелах.", type: "Навчання", date: new Date('2025-11-29T10:15:00'), isTopNews: false },
                { title: "Стройовий огляд", description: "Перевірка зовнішнього вигляду.", type: "Шикування", date: new Date('2025-12-01T08:00:00'), isTopNews: false },
                { title: "Лекція: Військова топографія", description: "Робота з картами масштабу 1:50000.", type: "Навчання", date: new Date('2025-12-01T12:00:00'), isTopNews: false },
                { title: "Практика: Керування БПЛА", description: "Симулятори FPV.", type: "Навчання", date: new Date('2025-12-02T14:00:00'), isTopNews: false },
                { title: "Самопідготовка", description: "Бібліотека або казарма.", type: "Розклад", date: new Date('2025-12-02T17:00:00'), isTopNews: false },
                { title: "Парко-господарський день (ПГД)", description: "Обслуговування техніки.", type: "Госп. роботи", date: new Date('2025-12-06T14:00:00'), isTopNews: false },
                { title: "Залік: Іноземна мова (STANAG)", description: "Військова термінологія НАТО.", type: "Іспит", date: new Date('2025-12-08T10:00:00'), isTopNews: false }
            ];
            await Event.insertMany(events);
            console.log('Data Seeded Successfully!');
        }
    } catch (error) {
        console.error('Seeding Error:', error);
    }
};

// --- PUBLIC ROUTES ---

// 1. REGISTER
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) return res.status(400).json({ message: "Username and password required" });

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        // SECURITY: Explicitly set role to 'user' to prevent privilege escalation via body injection
        await User.create({
            username,
            password: hashedPassword,
            role: 'user'
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. LOGIN
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // CREATE TOKEN
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Payload
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return Token + Role for Frontend
        res.json({
            token,
            role: user.role,
            username: user.username
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- PROTECTED ROUTES ---

// 3. GET EVENTS (Authenticated Users: Admin OR User)
app.get('/api/events', authenticateToken, async (req, res) => {
    try {
        // Allows both "admin" and "user" because authenticateToken passed
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. ADD EVENT (Admin ONLY)
app.post('/api/events', authenticateToken, async (req, res) => {
    // Role Check
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access Denied: Admins Only" });
    }

    const event = new Event(req.body);
    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 5. DELETE EVENT (Admin ONLY)
app.delete('/api/events/:id', authenticateToken, async (req, res) => {
    // Role Check
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access Denied: Admins Only" });
    }

    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Invalid ID or Server Error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});