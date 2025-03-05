import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default";

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(403).json({ error: "Invalid token" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN") return res.status(403).json({ error: "Admin access required" });
    next();
};
