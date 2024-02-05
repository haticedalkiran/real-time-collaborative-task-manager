export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;

  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  assignee: string;
  dueDate: Date;
  address: string;
}
