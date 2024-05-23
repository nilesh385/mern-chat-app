import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessagesSlice {
  messages: object[];
}

const initialState: MessagesSlice = {
  messages: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, actions: PayloadAction<object[]>) => {
      state.messages = actions.payload;
    },
  },
});

export const { setMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
