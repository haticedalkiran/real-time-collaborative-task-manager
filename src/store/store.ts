import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Tasks } from "./tasks.state";
import { ModalState } from "./modal.state";
import { AuthState } from "./auth.state";

const rootReducer = combineReducers({
  tasks: Tasks.reducer,
  modal: ModalState.reducer,
  auth: AuthState.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type AppDispatch = typeof store.dispatch;
