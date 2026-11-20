import bcrypt from "bcrypt";
import db from "../db/db.js";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
    const { name, email, password } = req.body;

    try {

        if (!name || !email || !password){
            return res.status(400).json({
                message: "Name, email, and password are required."
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashPassword]
        );

        const user = result.rows[0];

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000 * 24
        });

        res.status(201).json({
            message: "Successfully Registered",
            user: result.rows[0]
        });

    } catch (err) {
        console.log(err);

        if (err.code === "23505") {
            return res.status(409).json({
                message: "Email Already Registered."
            });
        }

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function loginUser(req, res) {

    const { email, password } = req.body;

    try {

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required."
            });
        }

        const result = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 60 * 60 * 1000 * 24
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name, 
                email: user.email
            }
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
}

export function logoutUser (req, res) {

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    })

    return res.status(200).json({
        message: "Logout Successful."
    });   
}