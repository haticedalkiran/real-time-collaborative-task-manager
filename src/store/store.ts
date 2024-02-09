import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import taskListenerMiddleware from "./taskListenerMiddleware";
import { Tasks } from "./tasks.state";

const rootReducer = combineReducers({
  tasks: Tasks.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), //.prepend(taskListenerMiddleware.middleware),
});
