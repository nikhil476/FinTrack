import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    function handleName(event) {
        const name = event.target.value;

        setName(name);
    }

    function handleEmail(event) {
        const email = event.target.value;

        setEmail(email);
    }

    function handlePassword(event) {
        const password = event.target.value;

        setPassword(password);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!name.trim() || !email.trim() || !password.trim()) {
            setMessage("All fields are required.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage("Please enter a valid email address.");
            return;
        }

        if (password.length < 8) {
            setMessage("Password must be at least 8 characters.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Registration failed");
                return;
            }

            navigate("/dashboard");

        } catch (err) {
            console.error(err);
            setMessage("Something went wrong. Please try again.");
        }

    }



    return (
        <div className="register-page">
            <div className="register-card">
                <h1>Register</h1>
                <p>Track Where You Spent.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            onChange={handleName}
                            placeholder="your name"
                            value={name}
                            required
                            minLength={2}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            onChange={handleEmail}
                            placeholder="you@email.com"
                            value={email}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                onChange={handlePassword}
                                placeholder="password"
                                value={password}
                                required
                                minLength={8}
                            />

                            <span
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁"}
                            </span>
                        </div>
                    </div>

                    <button type="submit">Submit</button>
                </form>

                <p>
                    Already have an account? <a href="/login">Sign up</a>
                </p>

                <h5>{message}</h5>

            </div>
        </div>
    )
}

export default Register;