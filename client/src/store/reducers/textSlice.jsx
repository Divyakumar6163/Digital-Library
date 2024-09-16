// textSlice.js
import { createSlice } from "@reduxjs/toolkit";

const textSlice = createSlice({
  name: "text",
  initialState: {
    content: "",
  },
  reducers: {
    setText: (state, action) => {
      state.content = action.payload;
    },
  },
});

export const { setText } = textSlice.actions;

export default textSlice.reducer;
