export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ITask {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  priority: PriorityLevel;
  status: TaskStatus;
  due_date: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthPayload {
  userId: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
