// app/api/types/Task.ts

export interface Task {
  id: string; // UUID, primary key
  title: string;
  description?: string | null;
  assigned_to?: string | null; // UUID or null
  group_id?: number | null; // Number or null
  created_by: string; // UUID referencing profiles.id
  due_date?: string | null; // ISO date string or null
  created_at: string; // ISO date string, automatically generated
  updated_at: string; // ISO date string, automatically generated
}

export type TaskInsert = Omit<Task, "id" | "created_at" | "updated_at">;
