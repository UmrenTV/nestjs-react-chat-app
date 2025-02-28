import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks"; // we'll create a typed useDispatch/useSelector
import { loginUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const authState = useAppSelector((state) => state.auth);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(loginUser({ username, password })).unwrap();
            // if login succeeded, navigate to chat
            navigate("/chat");
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {authState.error && (
                <p style={{ color: "red" }}>{authState.error}</p>
            )}
            <form onSubmit={handleLogin}>
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
                    {authState.status === "loading" ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
