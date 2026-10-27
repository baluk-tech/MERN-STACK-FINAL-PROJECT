const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).send({message: "Unauthorized: No token provided"});
        
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.user = payload; 
        next();
    } catch (err) {
        return res.status(401).send({message: "Unauthorized: Invalid token"});
    }
}

const adminAuthMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).send({message: "Unauthorized: No token provided"});
        
        let payload = jwt.verify(token, process.env.SECRET_KEY);
        if (!payload?.email || payload.email !== "admin@example.com") {
            return res.status(403).send({message: "Forbidden: Admin access required"});
        }
        next();
    } catch (err) {
        return res.status(401).send({message: "Unauthorized: Invalid token"});
    }
}

module.exports = { authMiddleware, adminAuthMiddleware };