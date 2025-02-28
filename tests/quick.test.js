// quick-test.js
const io = require("socket.io-client");

// create a POST request to auth/login with username 'jane' and password 'newpassword' and then store the token it returns to loginToken
const loginToken = fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        username: "jane",
        password: "newpassword",
    }),
});

if (loginToken.ok) {
    console.log("Login successful", loginToken.token);
}

const socket = io("http://localhost:3000", {
    auth: {
        token: loginToken.token,
    },
});

socket.on("connect", () => {
    console.log("Connected to server!");
});

socket.on("allMessages", (messages) => {
    console.log("Existing messages:", messages);
});

socket.on("newMessage", (message) => {
    console.log("Received new message:", message);
});

socket.emit("sendMessage", { content: "Hello from test client!" });

setTimeout(() => {
    console.log("Sending new message");
    socket.emit("sendMessage", { content: "New Message from test client!" });
}, 3000);

setTimeout(() => {
    console.log("Waiting on messages");
}, 10000);
