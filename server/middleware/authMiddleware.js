const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).send({message: "Unauthorization"});
        }
        let payload = jwt.verify(token, process.env.SECRET_KEY);
        if (!payload?.email || payload.email !== "admin@example.com") {
            res.status(401).send({message: "Unauthorization"});
        }
    } catch (err) {
        res.status(401).send({message: "Unauthorization", err});
    }
}

module.exports = authMiddleware;