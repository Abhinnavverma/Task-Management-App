export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MEMBER';
}

export interface Project {
    id: string;
    name: string;
    description?: string | null;
    ownerId: string;
    createdAt: string;
    _count?: { tasks: number };
}

export interface Task {
    id: string;
    title: string;
    description?: string | null;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    dueDate?: string | null;
    projectId: string;
    assigneeId?: string | null;
    assignee?: User | null;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardStats {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
}
