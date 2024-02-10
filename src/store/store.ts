import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import taskListenerMiddleware from "./taskListenerMiddleware";
import { Tasks } from "./tasks.state";
import { ModalState } from "./modal.state";

const rootReducer = combineReducers({
  tasks: Tasks.reducer,
  modal: ModalState.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), //.prepend(taskListenerMiddleware.middleware),
});
