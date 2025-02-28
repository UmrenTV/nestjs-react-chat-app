import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authState = useAppSelector((state) => state.auth);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(registerUser({ username, password })).unwrap();
            // after successful registration, navigate to login
            navigate("/login");
        } catch (err) {
            console.error("Register failed", err);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {authState.error && (
                <p style={{ color: "red" }}>{authState.error}</p>
            )}
            <form onSubmit={handleRegister}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={authState.status === "loading"}>
                    {authState.status === "loading" ? "Loading..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default Register;
