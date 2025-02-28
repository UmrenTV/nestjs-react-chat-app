import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    connectSocket,
    addMessage,
    setMessages,
    setConnected,
    disconnectSocket,
} from "../features/chat/chatSlice";
import { logout } from "../features/auth/authSlice";

const Chat: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const authState = useAppSelector((state) => state.auth);
    const chatState = useAppSelector((state) => state.chat);

    const [newMessage, setNewMessage] = useState("");
    // For autoscroll to bottom
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Simple dark mode toggle
    const [darkMode, setDarkMode] = useState(false);
    const toggleTheme = () => setDarkMode((prev) => !prev);

    // Connect socket on mount if user is logged in
    useEffect(() => {
        if (!authState.token) {
            navigate("/login");
            return;
        }
        if (!chatState.socket) {
            dispatch(connectSocket({ token: authState.token }));
        }
    }, [authState.token, chatState.socket, dispatch, navigate]);

    // Setup socket event listeners
    useEffect(() => {
        if (chatState.socket) {
            const { socket } = chatState;
            socket.on("connect", () => {
                dispatch(setConnected());
                console.log("Socket connected:", socket.id);
            });
            socket.on("allMessages", (messages) => {
                dispatch(setMessages(messages));
            });
            socket.on("newMessage", (message) => {
                dispatch(addMessage(message));
            });
            return () => {
                socket.off("connect");
                socket.off("allMessages");
                socket.off("newMessage");
            };
        }
    }, [chatState.socket, dispatch]);

    // Auto-scroll on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatState.messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatState.socket || !newMessage.trim()) return;
        chatState.socket.emit("sendMessage", { content: newMessage });
        setNewMessage("");
    };

    const handleLogout = () => {
        dispatch(logout());
        dispatch(disconnectSocket());
        navigate("/login");
    };

    /***********************
     *       STYLES
     ***********************/
    const outerWrapper: React.CSSProperties = {
        // Full viewport to center the container
        minHeight: "90vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: darkMode ? "#2c2c2c" : "#f9f9f9",
        color: darkMode ? "#fff" : "#000",
    };

    const navbarStyle: React.CSSProperties = {
        width: "80vw",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem",
        borderBottom: darkMode ? "1px solid #444" : "1px solid #ccc",
        backgroundColor: darkMode ? "#3a3a3a" : "#eee",
        marginTop: "1rem",
        borderRadius: "0.5rem",
    };

    const containerStyle: React.CSSProperties = {
        width: "80vw",
        height: "90vh",
        marginTop: "1rem",
        display: "flex",
        flexDirection: "column",
        border: darkMode ? "1px solid #444" : "1px solid #ccc",
        borderRadius: "0.5rem",
    };

    const chatAreaStyle: React.CSSProperties = {
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        borderRadius: "0.5rem",
    };

    const messagesContainerStyle: React.CSSProperties = {
        flex: 1,
        overflowY: "auto",
        padding: "1rem",
        // wrap long text
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        backgroundColor: darkMode ? "#2a2a2a" : "#f5f5f5",
    };

    const messageBubbleStyle = (isMe: boolean): React.CSSProperties => ({
        alignSelf: isMe ? "flex-end" : "flex-start",
        backgroundColor: isMe
            ? darkMode
                ? "#555"
                : "#dcf8c6"
            : darkMode
              ? "#444"
              : "#fff",
        color: darkMode ? "#fff" : "#000",
        padding: "0.5rem 1rem",
        borderRadius: "1rem",
        margin: "0.25rem auto",
        maxWidth: "96%",
        textAlign: isMe ? "right" : "left",
    });

    const formStyle: React.CSSProperties = {
        display: "flex",
        borderTop: darkMode ? "1px solid #444" : "1px solid #ccc",
    };

    const inputStyle: React.CSSProperties = {
        flex: 1,
        padding: "0.5rem",
        border: darkMode ? "1px solid #555" : "1px solid #ccc",
        backgroundColor: darkMode ? "#666" : "#fff",
        color: darkMode ? "#fff" : "#000",
    };

    const buttonStyle: React.CSSProperties = {
        padding: "0.5rem 1rem",
        border: "none",
        cursor: "pointer",
        backgroundColor: darkMode ? "#888" : "#007BFF",
        color: "#fff",
    };

    return (
        <div style={outerWrapper}>
            {/* NAVBAR */}
            <div style={navbarStyle}>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <Link
                        to="/login"
                        style={{ color: darkMode ? "#eee" : "#333" }}
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        style={{ color: darkMode ? "#eee" : "#333" }}
                    >
                        Register
                    </Link>
                    <Link
                        to="/chat"
                        style={{ color: darkMode ? "#eee" : "#333" }}
                    >
                        Chat
                    </Link>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                    }}
                >
                    <button style={buttonStyle} onClick={toggleTheme}>
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                    <button style={buttonStyle} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* MAIN CHAT CONTAINER */}
            <div style={containerStyle}>
                <div style={chatAreaStyle}>
                    <div style={messagesContainerStyle}>
                        {chatState.messages.map((msg) => {
                            const isMe = msg.sender === authState.username;
                            return (
                                <div
                                    key={msg._id ?? Math.random()}
                                    style={messageBubbleStyle(isMe)}
                                >
                                    {/* Show sender's name if it's not me */}
                                    {!isMe && (
                                        <div
                                            style={{
                                                fontWeight: "bold",
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            {msg.sender}
                                        </div>
                                    )}
                                    {msg.content}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <form style={formStyle} onSubmit={handleSendMessage}>
                        <input
                            style={inputStyle}
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button style={buttonStyle} type="submit">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
