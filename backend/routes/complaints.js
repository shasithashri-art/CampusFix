const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// CREATE a complaint (must be logged in)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const userId = req.user.id; // comes from the token, not the request body

        if (!title || !description || !category) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const result = await pool.query(
            `INSERT INTO complaints (user_id, title, description, category)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [userId, title, description, category]
        );

        res.status(201).json({ success: true, complaint: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// LIST all complaints (must be logged in) — includes auto-escalation check
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT c.*, u.name AS reported_by
             FROM complaints c
             JOIN users u ON c.user_id = u.id
             ORDER BY c.created_at DESC`
        );

        // auto-escalation logic: if Open and older than 24 hours, mark as Escalated for display
        const now = new Date();
        const complaints = result.rows.map((complaint) => {
            const hoursSinceCreated = (now - new Date(complaint.created_at)) / (1000 * 60 * 60);
            const displayStatus =
                complaint.status === "Open" && hoursSinceCreated > 24
                    ? "Escalated"
                    : complaint.status;

            return { ...complaint, displayStatus };
        });

        res.json({ success: true, complaints });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// UPDATE status (admin only)
router.patch("/:id/status", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Only admins can update status" });
        }

        const { status } = req.body;
        const { id } = req.params;

        const validStatuses = ["Open", "In Progress", "Resolved"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const result = await pool.query(
            `UPDATE complaints SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        res.json({ success: true, complaint: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// DELETE a complaint (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Only admins can delete complaints" });
        }

        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM complaints WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        res.json({ success: true, message: "Complaint deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;