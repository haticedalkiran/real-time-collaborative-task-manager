export interface Task {
  _id: string;
  id: string;
  title: string;
  detail: string;
  status: string;

  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  assignee: string;
  dueDate: string;
}
