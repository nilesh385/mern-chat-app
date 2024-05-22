import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface friendsState {
  friends: object[];
  requests: object[];
}

const initialState: friendsState = {
  friends: [],
  requests: [],
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<object[]>) => {
      state.friends = action.payload;
    },
    setRequests: (state, action: PayloadAction<object[]>) => {
      state.requests = action.payload;
    },
  },
});

export const { setFriends, setRequests } = friendsSlice.actions;

export default friendsSlice.reducer;
