import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Task } from "../interfaces/task";

type ActionStatus = "create" | "update" | "";
interface TasksState {
  action: ActionStatus;
  task: Task;
}

const initialState: TasksState = {
  action: "",
  task: {} as Task,
};

export const ModalState = createSlice({
  name: "ModalState",
  initialState: initialState,
  reducers: {
    setAction: (state, action: PayloadAction<ActionStatus>) => {
      state.action = action.payload;
    },
    setSelectedTask: (state, action: PayloadAction<Task>) => {
      console.log("action.payload", action.payload);
      state.task = action.payload;
    },
  },
});
export const { setAction, setSelectedTask } = ModalState.actions;

export default ModalState.reducer;
