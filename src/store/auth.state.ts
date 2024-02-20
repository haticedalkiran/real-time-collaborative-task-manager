import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../interfaces/user";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(import.meta.env.VITE_SOCKET_URL + "/users");
      if (!response.ok) {
        throw new Error("Server error!");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  userList: User[];
}

const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  isLoggedIn: localStorage.getItem("isLoggedIn") ? true : false,

  userList: [],
};
export const AuthState = createSlice({
  name: "Auth",
  initialState: initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("isLoggedIn", "true");
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<User[]>) => {
        state.userList = action.payload;
      }
    );
  },
});

export const { loginSuccess, logout } = AuthState.actions;

export default AuthState.reducer;
