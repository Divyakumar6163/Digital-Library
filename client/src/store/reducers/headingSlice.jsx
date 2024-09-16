import { createSlice } from "@reduxjs/toolkit";

const headingSlice = createSlice({
  name: "heading",
  initialState: {
    content: "",
  },
  reducers: {
    setHeading: (state, action) => {
      state.content = action.payload;
    },
  },
});

export const { setHeading } = headingSlice.actions;

export default headingSlice.reducer;
