// quick-test.js
const { io } = require("socket.io-client"); // Make sure socket.io-client is installed

// Wrap everything in an async function:
(async () => {
    try {
        // 0. Register with random credentials
        const username = Math.random().toString(36).substring(2);
        const password = Math.random().toString(36).substring(2);

        const registerRes = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        if (registerRes.ok) {
            console.log(
                "Register successful. Username:",
                username,
                "Password:",
                password
            );
        }

        console.log(
            `Trying to login with username ${username} and password ${password}`
        );

        // 1. Log in to get the token
        const loginRes = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: HTTP ${loginRes.status}`);
        }

        const loginData = await loginRes.json();
        const loginToken = loginData.token;
        console.log("Login successful. Token:", loginToken);

        // 2. Connect via Socket.IO using the token in the auth field
        const socket = io("http://localhost:3000", {
            auth: { token: loginToken },
        });

        socket.on("connect", () => {
            console.log("Connected to server! ID:", socket.id);
        });

        socket.on("allMessages", (messages) => {
            console.log("Existing messages:", messages);
        });

        socket.on("newMessage", (message) => {
            console.log("Received new message:", message);
        });

        // 3. Emit a test message immediately
        console.log("Sending new test message...");
        socket.emit("sendMessage", { content: "New test message." });

        // 4. Emit another message 3 seconds later
        setTimeout(() => {
            console.log("Sending another new message...");
            socket.emit("sendMessage", {
                content: "New message from test client after 3s",
            });
        }, 3000);
    } catch (err) {
        console.error("Error:", err);
    }
})();
