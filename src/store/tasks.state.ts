import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Task } from "../interfaces/task";

interface TasksState {
  tasks: Task[];
  loading: boolean;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
};

export const Tasks = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    receiveTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task?._id !== action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      state.tasks = state.tasks.map((task) => {
        if (task._id === action.payload._id) {
          return action.payload;
        }
        return task;
      });
    },
  },
});
export const { receiveTasks, addTask, deleteTask, updateTask } = Tasks.actions;

export default Tasks.reducer;
