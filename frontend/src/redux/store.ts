import { configureStore } from "@reduxjs/toolkit";
import userReducers from "./userSlice";
import friendsReducers from "./friendsSlice";
import conversationsReducers from "./conversationsSlice";
import messagesReducers from "./messagesSlice";

const store = configureStore({
  reducer: {
    user: userReducers,
    friends: friendsReducers,
    conversations: conversationsReducers,
    messages: messagesReducers,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
