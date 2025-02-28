// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
    token: string | null;
    username: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: AuthState = {
    token: null,
    username: null,
    status: "idle",
    error: null,
};

// Async thunks for register and login
export const registerUser = createAsyncThunk(
    "auth/register",
    async (payload: { username: string; password: string }) => {
        const response = await axios.post(
            "http://localhost:3000/auth/register",
            payload
        );
        return response.data; // e.g. { message: 'User created successfully' }
    }
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (payload: { username: string; password: string }) => {
        const response = await axios.post(
            "http://localhost:3000/auth/login",
            payload
        );
        // response.data should be { token: '...' }
        return {
            token: response.data.token,
            username: payload.username,
        };
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.username = null;
            localStorage.removeItem("token");
            localStorage.removeItem("username");
        },
        setCredentials(
            state,
            action: PayloadAction<{ token: string; username: string }>
        ) {
            state.token = action.payload.token;
            state.username = action.payload.username;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("username", action.payload.username);
        },
        loadFromStorage(state) {
            const token = localStorage.getItem("token");
            const username = localStorage.getItem("username");
            if (token && username) {
                state.token = token;
                state.username = username;
            }
        },
    },
    extraReducers: (builder) => {
        // registerUser
        builder.addCase(registerUser.pending, (state) => {
            state.status = "loading";
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state) => {
            state.status = "succeeded";
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message || "Registration failed";
        });

        // loginUser
        builder.addCase(loginUser.pending, (state) => {
            state.status = "loading";
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            const { token, username } = action.payload;
            state.status = "succeeded";
            state.token = token;
            state.username = username;
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message || "Login failed";
        });
    },
});

export const { logout, setCredentials, loadFromStorage } = authSlice.actions;

export default authSlice.reducer;
