const jwt = require("jsonwebtoken");

module.exports = {
    verifyToken: (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    },

    isAdmin: (req, res, next) => {
        if (req.user.role !== "administrator") {
            return res.status(403).json({ message: "Access denied: Administrators only!" });
        }
        next();
    }
};