import jwt from "jsonwebtoken";

export function authMiddleware (req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired."
        }); 
    }
}