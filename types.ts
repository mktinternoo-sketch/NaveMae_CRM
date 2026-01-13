
export type DemandStatus = 'BACKLOG' | 'FAZENDO' | 'REVISAO' | 'ENTREGUE';
export type DemandPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type UserRole = 'ADMIN' | 'GESTOR' | 'MEMBRO' | 'VIEWER';

export interface Profile {
  id: string;
  name: string;
  job_title: string;
  bio?: string;
  instagram?: string;
  avatar_url?: string;
  birth_date?: string;
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: UserRole;
  status: 'active' | 'inactive';
  profile?: Profile;
}

export interface ClientLink {
  id: string;
  label: string;
  url: string;
}

export interface Client {
  id: string;
  workspace_id?: string;
  name: string;
  logo?: string;
  logo_url?: string;
  cover_url?: string; // Adicionado para imagem de cabeçalho
  instagram?: string;
  drive_link?: string;
  brandbook_link?: string;
  notes?: string;
  wiki?: string;
  wiki_json?: any; // TipTap content
  description?: string;
  links: ClientLink[];
  tags: string[];
}

export interface Demand {
  id: string;
  client_id: string;
  title: string;
  description: string;
  type: string;
  priority: DemandPriority;
  status: DemandStatus;
  due_date: string;
  owner_id: string;
  reviewer_id?: string;
  tags: string[];
  created_at: string;
  delivered_at?: string;
}

export interface DemandEvent {
  id: string;
  demand_id: string;
  actor_id: string;
  event_type: string;
  from_value: string;
  to_value: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  photo?: string;
  birthDate?: string;
}

export type Status = 'To Do' | 'In Progress' | 'Review' | 'Done';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  dueDate: string;
  clientId: string;
  type?: string;
  tags?: string[];
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
