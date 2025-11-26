const express = require("express");
const products = express.Router();
const db = require("../db/index");
const { verifyToken, isAdmin } = require("../middleware/auth");

/* ======== START ADMIN ONLY ENDPOINTS ======== */
/* CREATE ONE NEW ACTIVE Product - Admin Only */
products.post("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, product_code, price, stock } = req.body;
    
        const query = `
            INSERT INTO products (
                name,
                product_code,
                price,
                stock
            ) VALUES (?, ?, ?, ?)
        `;
        const params = [name, product_code, price, stock];

        await db.query(query, params);

        res.status(201).json({ message: "New product added successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

/* UPDATE ONE ACTIVE Product by ID - Admin Only */
products.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, product_code, price, stock } = req.body;
    
        const query = `
            UPDATE products p
            SET
                p.name = ?,
                p.product_code = ?,
                p.price = ?,
                p.stock = ?
            WHERE 
            p.is_active = TRUE AND
            p.product_id = ?
        `;
        const params = [name, product_code, price, stock, id];

        const [products] = await db.query(query, params);

        if (products.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found!" });
        }

        res.status(200).json({ message: "Product updated successfully!" });
    } catch (err) {
        console.error(err);

        // Product code has already been taken
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Product code already exists!" });
        }

        res.status(500).json({ message: err.message });
    }
});

/* DEACTIVATE ONE ACTIVE Product by ID - Admin Only */
products.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
    
        const query = `
            UPDATE products p
            SET
                p.is_active = FALSE,
                p.deleted_at = CURRENT_TIMESTAMP
            WHERE 
                p.is_active = TRUE AND
                p.product_id = ?
        `;
        const params = [id];

        const [products] = await db.query(query, params);
        
        if (products.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found!" });
        }

        res.status(200).json({ message: "Product deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

/* GET ALL INACTIVE Products - Admin Only */
products.get("/inactive", verifyToken, isAdmin, async (req, res) => {
    try {
        const query = `
            SELECT
                p.product_id,
                p.name,
                p.product_code,
                p.price,
                p.stock,
                p.created_at,
                p.updated_at,
                p.deleted_at
            FROM products p
            WHERE p.is_active = FALSE
        `;

        const [products] = await db.query(query);

        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

/* GET ONE INACTIVE Product by ID - Admin Only */
products.get("/inactive/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
    
        const query = `
            SELECT
                p.product_id,
                p.name,
                p.product_code,
                p.price,
                p.stock,
                p.created_at,
                p.updated_at,
                p.deleted_at
            FROM products p
            WHERE 
                p.is_active = FALSE AND
                p.product_id = ?
        `;
        const params = [id];

        const [products] = await db.query(query, params);

        if (products.length === 0) {
            return res.status(404).json({ message: "Product not found!" });
        }

        res.status(200).json(products[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

/* REACTIVATE ONE ACTIVE Product by ID - Admin Only */
products.post("/reactivate/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
    
        const query = `
            UPDATE products p
            SET p.is_active = TRUE
            WHERE 
                p.is_active = FALSE AND 
                p.product_id = ?
        `;
        const params = [id];

        const [products] = await db.query(query, params);
        
        if (products.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found!" });
        }

        res.status(200).json({ message: "Product reactivated successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
/* ======== END ADMIN ONLY ENDPOINTS ======== */

/* ======== START PUBLIC ENDPOINTS ======== */
/* GET ALL ACTIVE Products */
products.get("/", verifyToken, async (req, res) => {
    try {
        const query = `
            SELECT
                p.product_id,
                p.name,
                p.product_code,
                p.price,
                p.stock,
                p.created_at,
                p.updated_at
            FROM products p
            WHERE p.is_active = TRUE
        `;

        const [products] = await db.query(query);

        // Filter data for members
        if (req.user.role !== "administrator") {
            const filtered = products.map(product => ({
                product_id: product.product_id,
                name: product.name,
                product_code: product.product_code,
                price: product.price,
                stock: product.stock
            }));

            return res.status(200).json(filtered);
        }

        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

/* GET ONE ACTIVE Product by ID */
products.get("/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT
                p.product_id,
                p.name,
                p.product_code,
                p.price,
                p.stock,
                p.created_at,
                p.updated_at
            FROM products p
            WHERE 
                p.is_active = TRUE AND
                p.product_id = ?
        `;
        const params = [id];
        
        const [products] = await db.query(query, params);
        
        if (products.length === 0) {
            return res.status(404).json({ message: "Product not found!" });
        }
        
        // Filter data for members
        if (req.user.role !== "administrator") {
            const filtered = products.map(product => ({
                product_id: product.product_id,
                name: product.name,
                product_code: product.product_code,
                price: product.price,
                stock: product.stock
            }));
            
            return res.status(200).json(filtered[0]);
        }
        
        res.status(200).json(products[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
/* ======== END PUBLIC ENDPOINTS ======== */

module.exports = products;