import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { loadFromStorage } from "./features/auth/authSlice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // on app mount, load any stored credentials from localStorage
        dispatch(loadFromStorage());
    }, [dispatch]);

    return (
        <Router>
            <nav>
                <Link to="/login">Login</Link> |{" "}
                <Link to="/register">Register</Link> |{" "}
                <Link to="/chat">Chat</Link> |{" "}
            </nav>

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="*" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
