const express = require("express");
const cors = require("cors");
const pool = require("./db");
const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("CampusFix Backend is running!");
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ success: true, time: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.use("/auth", authRoutes);
app.use("/complaints", complaintRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});