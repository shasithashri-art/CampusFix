const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>" → just the token part

    try {
        const decoded = jwt.verify(token, "campusfix_secret_key");
        req.user = decoded; // now every route after this can use req.user.id and req.user.role
        next(); // move on to the actual route
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

module.exports = authMiddleware;