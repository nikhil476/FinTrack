import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";


function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState({});
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();


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

        if (!email.trim() || !password.trim()) {
            setMessage("All fields are required.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage("Please enter a valid email address.");
            return;
        }

        const response = await fetch("https://fintrack-api-da0c.onrender.com/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        console.log(response.status);
        console.log(data);

        setUser(data);

        if (!response.ok) {
            setMessage("Invalid email or password.");
            return;
        }

        navigate("/dashboard");

    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Welcome back</h1>
                <p>Sign in to manage your finances.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            id="email"
                            type="email"
                            onChange={handleEmail}
                            value={email}
                            placeholder="you@email.com"
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
                                value={password}
                                placeholder="Enter your password"
                                required
                            />

                            <span
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁"}
                            </span>
                        </div>
                    </div>

                    <button type="submit">Sign in</button>
                </form>

                <p>
                    Dont have an account? <a href="/register">Create one</a>
                </p>

                <p>{message}</p>
            </div>
        </div>
    );
}

export default Login;