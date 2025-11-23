const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Get token from header: "Authorization: Bearer <token>"
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'Access Denied: No token provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach user info to the request
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid Token' });
    }
};

module.exports = verifyToken;