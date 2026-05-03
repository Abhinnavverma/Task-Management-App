import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { apiSlice } from '../api/api';
import type { RootState } from '../../store/store';
import { logout } from '../auth/authSlice';
import { useGetDashboardStatsQuery, useGetUsersQuery } from './dashboardApi';
import {
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskStatusMutation,
} from '../tasks/taskApi';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCreateProjectMutation, useGetProjectsQuery } from '../projects/projectsApi';

import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/layout/StatCard';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { FormDialog } from '@/components/layout/FormDialog';

export default function DashboardPage() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const isAdmin = user?.role === 'ADMIN';

    const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
    const { data: projects, isLoading: projectsLoading } = useGetProjectsQuery();
    const { data: tasks, isLoading: tasksLoading } = useGetTasksQuery(undefined);
    const { data: users } = useGetUsersQuery(undefined);

    const [createProject] = useCreateProjectMutation();
    const [createTask] = useCreateTaskMutation();
    const [updateStatus] = useUpdateTaskStatusMutation();

    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [isTaskOpen, setIsTaskOpen] = useState(false);

    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        projectId: '',
        dueDate: '',
        assigneeId: '',
    });

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProject.name) return;
        await createProject(newProject);
        setNewProject({ name: '', description: '' });
        setIsProjectOpen(false);
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.title || !newTask.projectId) return;

        const payload = {
            ...newTask,
            description: newTask.description || undefined,
            dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : undefined,
            assigneeId: newTask.assigneeId || undefined,
        };

        await createTask(payload);
        setNewTask({ title: '', description: '', projectId: '', dueDate: '', assigneeId: '' });
        setIsTaskOpen(false);
    };

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        await updateStatus({ taskId, status: newStatus });
    };

    const handleLogout = () => {
        dispatch(logout());
        dispatch(apiSlice.util.resetApiState());
    };

    if (statsLoading || projectsLoading || tasksLoading) {
        return <div className="p-10 text-center">Loading dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <Header
                title={`Welcome, ${user?.name}`}
                subtitle={
                    <>
                        Role:{' '}
                        <Badge variant={isAdmin ? 'default' : 'secondary'}>{user?.role}</Badge>
                    </>
                }
                action={
                    <Button variant="outline" onClick={handleLogout}>
                        Log Out
                    </Button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Tasks" value={stats?.total || 0} />
                <StatCard title="To Do" value={stats?.todo || 0} />
                <StatCard title="In Progress" value={stats?.inProgress || 0} />
                <StatCard
                    title="Done"
                    value={stats?.done || 0}
                    valueClassName="text-3xl font-bold text-green-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <SectionHeader
                        title="Projects"
                        action={
                            isAdmin && (
                                <FormDialog
                                    title="Create Project"
                                    trigger={<Button size="sm">New Project</Button>}
                                    open={isProjectOpen}
                                    onOpenChange={setIsProjectOpen}
                                >
                                    <form onSubmit={handleCreateProject} className="space-y-4">
                                        <Input
                                            placeholder="Project Name"
                                            value={newProject.name}
                                            onChange={(e) =>
                                                setNewProject({
                                                    ...newProject,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                        <Input
                                            placeholder="Description (Optional)"
                                            value={newProject.description}
                                            onChange={(e) =>
                                                setNewProject({
                                                    ...newProject,
                                                    description: e.target.value,
                                                })
                                            }
                                        />
                                        <Button type="submit" className="w-full">
                                            Save
                                        </Button>
                                    </form>
                                </FormDialog>
                            )
                        }
                    />
                    {projects?.map((proj) => (
                        <Card key={proj.id} className="p-4">
                            <h3 className="font-medium">{proj.name}</h3>
                            {proj.description && (
                                <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                {proj._count?.tasks || 0} tasks
                            </p>
                        </Card>
                    ))}
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <SectionHeader
                        title="Tasks"
                        action={
                            isAdmin && (
                                <FormDialog
                                    title="Create Task"
                                    trigger={<Button size="sm">New Task</Button>}
                                    open={isTaskOpen}
                                    onOpenChange={setIsTaskOpen}
                                >
                                    <form onSubmit={handleCreateTask} className="space-y-4">
                                        <Input
                                            placeholder="Task Title"
                                            value={newTask.title}
                                            onChange={(e) =>
                                                setNewTask({ ...newTask, title: e.target.value })
                                            }
                                        />
                                        <Input
                                            placeholder="Description (Optional)"
                                            value={newTask.description}
                                            onChange={(e) =>
                                                setNewTask({
                                                    ...newTask,
                                                    description: e.target.value,
                                                })
                                            }
                                        />
                                        <Select
                                            onValueChange={(val) =>
                                                setNewTask({ ...newTask, projectId: val })
                                            }
                                            value={newTask.projectId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Project" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {projects?.map((p) => (
                                                    <SelectItem key={p.id} value={p.id}>
                                                        {p.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            onValueChange={(val) =>
                                                setNewTask({ ...newTask, assigneeId: val })
                                            }
                                            value={newTask.assigneeId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Assign to Member (Optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users?.map((u) => (
                                                    <SelectItem key={u.id} value={u.id}>
                                                        {u.name} ({u.role})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Input
                                            type="date"
                                            placeholder="Due Date (Optional)"
                                            value={newTask.dueDate}
                                            onChange={(e) =>
                                                setNewTask({ ...newTask, dueDate: e.target.value })
                                            }
                                        />
                                        <Button type="submit" className="w-full">
                                            Save Task
                                        </Button>
                                    </form>
                                </FormDialog>
                            )
                        }
                    />

                    <div className="space-y-2">
                        {tasks?.map((task) => {
                            const assigneeName =
                                task.assignee?.name ||
                                users?.find((u) => u.id === task.assigneeId)?.name;

                            return (
                                <Card
                                    key={task.id}
                                    className="p-4 flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                                        {task.description && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {task.description}
                                            </p>
                                        )}
                                        <div className="flex gap-2 items-center mt-2">
                                            {task.dueDate && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs font-normal"
                                                >
                                                    Due:{' '}
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </Badge>
                                            )}

                                            {assigneeName && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs font-normal bg-blue-50 text-blue-700"
                                                >
                                                    Assigned: {assigneeName}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <Select
                                        defaultValue={task.status}
                                        onValueChange={(val) => handleStatusChange(task.id, val)}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TODO">To Do</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                            <SelectItem value="DONE">Done</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Card>
                            );
                        })}
                        {tasks?.length === 0 && (
                            <p className="text-gray-500 italic">No tasks found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
