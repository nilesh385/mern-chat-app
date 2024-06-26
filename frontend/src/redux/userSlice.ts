import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the user state interface
interface UserState {
  user: object;
  onlineUsers: string[];
  searchedUsers: object[];
  selectedUser: object;
}

// console.log(JSON.parse(localStorage.getItem("user")));
const userFromStrorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)
  : null;

const initialState: UserState = {
  user: userFromStrorage,
  onlineUsers: [],
  searchedUsers: [],
  selectedUser: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUser: (state, action: PayloadAction<object>) => {
      state.user = action.payload;
    },
    setOnlineUser: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    setSearchedUsers: (state, action: PayloadAction<object[]>) => {
      state.searchedUsers = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<object>) => {
      state.selectedUser = action.payload;
    },
  },
});

export const { setUser, setOnlineUser } = userSlice.actions;
export default userSlice.reducer;
