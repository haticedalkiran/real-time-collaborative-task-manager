import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Task } from "../interfaces/task";

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const Tasks = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    receiveTasks: (state, action: PayloadAction<any>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<any>) => {
      state.tasks.push(action.payload);
    },
    deleteTask: (state, action: PayloadAction<any>) => {
      console.log("deleteTask", action.payload);
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    },
  },
});
export const { receiveTasks, addTask, deleteTask } = Tasks.actions;

export default Tasks.reducer;
