import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface socketSlice {
  socket: string;
}

const initialState: socketSlice = {
  socket: "",
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, actions: PayloadAction<string>) => {
      state.socket = actions.payload;
    },
  },
});
