const express = require("express");
const users = express.Router();
const db = require("../db/index");
const bcrypt = require("bcryptjs");
const { verifyToken, isAdmin } = require("../middleware/auth");

/* ======== START ADMIN ONLY ENDPOINTS ======== */
/* UPDATE ONE ACTIVE User By ID - Admin Only */
users.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, password } = req.body;
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const query = `
            UPDATE users u
            SET
                u.name = ?,
                u.username = ?, 
                u.password = ?
            WHERE 
                u.is_active = TRUE AND
                u.user_id = ? 
        `;
        const params = [name, username, hashedPassword, id];

        const [users] = await db.query(query, params);

        if (users.affectedRows === 0) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json({ message: "User updated successfully!" });
    } catch (err) {
        console.error(err);

        // Username has already been taken
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Username already exists!" });
        }

        res.status(500).json({ message: err.message });
    }
});

/* DEACTIVATE ONE ACTIVE User By ID - Admin Only */
users.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
    
        const query = `
            UPDATE users u 
            SET
                u.is_active = FALSE,
                u.deleted_at = CURRENT_TIMESTAMP
            WHERE 
                u.is_active = TRUE AND
                u.user_id = ?
        `;
        const params = [id];

        const [users] = await db.query(query, params);

        if (users.affectedRows === 0) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json({ message: `User deleted successfully!` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

/* GET ALL INACTIVE User - Admin Only */
users.get("/inactive", verifyToken, isAdmin, async (req, res) => {
    try {
        const query = `
            SELECT 
                u.user_id,
                u.name,
                u.username,
                u.password,
                u.role,
                u.created_at,
                u.updated_at,
                u.deleted_at
            FROM users u 
            WHERE u.is_active = FALSE
        `;

        const [users] = await db.query(query);

        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

/* GET ONE INACTIVE User By ID - Admin Only */
users.get("/inactive/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                u.user_id,
                u.name,
                u.username,
                u.password,
                u.role,
                u.created_at,
                u.updated_at,
                u.deleted_at
            FROM users u
            WHERE 
                u.is_active = FALSE AND 
                u.user_id = ?
        `;
        const params = [id];

        const [users] = await db.query(query, params);

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json(users[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

/* REACTIVATE ONE User By ID - Admin Only */
users.post("/reactivate/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            UPDATE users u
            SET u.is_active = TRUE
            WHERE 
                u.is_active = FALSE AND
                u.user_id = ? 
        `;
        const params = [id];

        const [users] = await db.query(query, params);

        if (users.affectedRows === 0) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json({ message: `User reactivated successfully!` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
/* ======== END ADMIN ONLY ENDPOINTS ======== */

/* ======== START PUBLIC ENDPOINTS ======== */
/* GET ALL ACTIVE Users */
users.get("/", verifyToken, async (req, res) => {
    try {
        const query = `
            SELECT 
                u.user_id,
                u.name,
                u.username,
                u.password,
                u.role,
                u.created_at,
                u.updated_at
            FROM users u
            WHERE u.is_active = TRUE
        `;

        const [users] = await db.query(query);

        // Filter data for members
        if (req.user.role !== "administrator") {
            const filtered = users.map(user => ({
                user_id: user.user_id,
                name: user.name,
                username: user.username,
                role: user.role
            }));

            return res.status(200).json(filtered);
        }

        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

/* GET ONE ACTIVE User By ID */
users.get("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
    
        const query = `
            SELECT 
                u.user_id,
                u.name,
                u.username,
                u.password,
                u.role,
                u.created_at,
                u.updated_at
            FROM users u 
            WHERE 
                u.is_active = TRUE AND
                u.user_id = ?
        `;
        const params = [id];

        const [users] = await db.query(query, params);

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Filter data for members
        if (req.user.role !== "administrator") {
            const filtered = users.map(user => ({
                user_id: user.user_id,
                name: user.name,
                username: user.username,
                role: user.role
            }));

            return res.status(200).json(filtered[0]);
        }

        res.status(200).json(users[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
/* ======== END PUBLIC ENDPOINTS ======== */

module.exports = users;