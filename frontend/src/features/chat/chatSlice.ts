import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

interface Message {
    _id?: string;
    sender: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ChatState {
    messages: Message[];
    socket: Socket | null;
    status: "idle" | "connecting" | "connected" | "failed";
    error: string | null;
}

const initialState: ChatState = {
    messages: [],
    socket: null,
    status: "idle",
    error: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        connectSocket(state, action: PayloadAction<{ token: string }>) {
            // if the socket is already connected, don't re-connect
            if (state.socket) return;
            state.status = "connecting";
            const { token } = action.payload;

            // Initialize the socket with auth
            const socket = io("http://localhost:3000", {
                auth: {
                    token,
                },
            });
            state.socket = socket as unknown as Socket;
        },
        setConnected(state) {
            state.status = "connected";
        },
        setMessages(state, action: PayloadAction<Message[]>) {
            state.messages = action.payload;
        },
        addMessage(state, action: PayloadAction<Message>) {
            state.messages.push(action.payload);
        },
        setChatError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.status = "failed";
        },
        disconnectSocket(state) {
            if (state.socket) {
                state.socket.disconnect();
            }
            state.socket = null;
            state.messages = [];
            state.status = "idle";
            state.error = null;
        },
    },
});

export const {
    connectSocket,
    setConnected,
    setMessages,
    addMessage,
    setChatError,
    disconnectSocket,
} = chatSlice.actions;

export default chatSlice.reducer;
