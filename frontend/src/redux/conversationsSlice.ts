import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConversationsSlice {
  conversations: object[];
}

const initialState: ConversationsSlice = {
  conversations: [],
};

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setConversations: (state, actions: PayloadAction<object[]>) => {
      state.conversations = actions.payload;
    },
  },
});

export const { setConversations } = conversationsSlice.actions;

export default conversationsSlice.reducer;
