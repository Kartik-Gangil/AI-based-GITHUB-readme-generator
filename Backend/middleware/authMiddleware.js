import { config } from "dotenv";
import jwt from "jsonwebtoken";
config()

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    // console.log({token})

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({ message: "Invalid token" });

    }
};

export default authMiddleware