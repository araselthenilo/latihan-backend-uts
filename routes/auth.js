const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/index");

const auth = express.Router();

/* SIGNUP */
auth.post("/signup", async (req, res) => {
    try {
        const { name, username, password } = req.body;

        const roleMember = "member";
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (
                name,
                username,
                password, 
                role
            ) VALUES (?, ?, ?, ?)
        `;
        const params = [name, username, hashedPassword, roleMember];

        await db.query(query, params);

        res.status(201).json({ message: "New user added successfully!" });
    } catch (err) {
        console.error(err);

        // Username has already been taken
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Username already exists!" });
        }

        res.status(500).json({ message: err.message });
    }
});

/* SIGNIN AUTHENTICATION */
auth.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        const query = `
            SELECT
                u.user_id,
                u.name,
                u.username,
                u.password,
                u.role
            FROM users u
            WHERE 
                u.is_active = TRUE AND
                u.username = ?
        `;
        const params = [username];

        const [users] = await db.query(query, params);

        // Invalid username or password
        if (users.length === 0 || !await bcrypt.compare(password, users[0].password)) {
            return res.status(401).json({ message: "Invalid username or password!" });
        }

        const expireDuration = process.env.JWT_EXPIRATION || "1h";
        const token = jwt.sign(
            {
                user_id: users[0].user_id,
                name: users[0].name,
                username: users[0].username,
                role: users[0].role
            }, 
            process.env.JWT_SECRET,
            { expiresIn: `${expireDuration}` }
        );

        // Setting The Cookie
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "strict" : "lax",
            maxAge: 3600000
        });

        // Success Login
        res.status(200).json({ 
            message: "Successfully logged in!", 
            user: {
                user_id: users[0].user_id,
                name: users[0].name,
                username: users[0].username,
                role: users[0].role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

/* SIGNOUT */
auth.get("/signout", async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "strict" : "lax"
        });

        res.status(200).json({ message: "Successfully signed out!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = auth;