export interface Task {
  _id?: string;
  id?: string;
  title: string;
  detail: string;
  status: string;
  reporter: string;
  assignee?: string;
  dueDate?: string;

  createdAt: string;
  updatedAt?: string;
  updatedBy?: string;
}
