
export type Status = 'To Do' | 'In Progress' | 'Review' | 'Done';
export type Priority = 'Low' | 'Medium' | 'High';

export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  role: 'Admin' | 'Member';
  joinedAt: string;
  birthDate?: string; // Format: YYYY-MM-DD
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  dueDate: string;
  clientId: string;
}

export interface Link {
  id: string;
  label: string;
  url: string;
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  description: string;
  wiki: string;
  links: Link[];
  tags: string[];
}

export interface TableColumn {
  id: string;
  header: string;
  type: 'text' | 'number' | 'select' | 'date';
}

export interface TableRow {
  id: string;
  data: Record<string, any>;
}

export interface CustomTable {
  id: string;
  name: string;
  columns: TableColumn[];
  rows: TableRow[];
}

export interface AIMessage {
  role: 'user' | 'model';
  text: string;
}
