import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  token: null,
  email: null,
  password: null,
  name: null,
  isPremium: null,
  status: "idle",
  error: null,
};

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    console.log(userData);
    try {
      const response = await axios.post(
        "http://localhost:5000/user/login",
        userData
      );
      return response.data; // Make sure this returns the correct data structure
    } catch (error) {
      return rejectWithValue(error.response.data); // Use rejectWithValue for proper error handling
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.name = action.payload.name;
      state.isPremium = action.payload.isPremium;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.token = action.payload.token;
        state.email = action.payload.email;
        state.password = action.payload.password;
        state.name = action.payload.name;
        state.isPremium = action.payload.isPremium;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.token = action.payload.token;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.isPremium = action.payload.isPremium;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
