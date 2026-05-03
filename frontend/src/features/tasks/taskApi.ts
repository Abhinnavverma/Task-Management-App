import type { Task } from '@/types/models';
import { apiSlice } from '../api/api';

export const tasksApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTasks: builder.query<Task[], string | void>({
            query: (projectId?: string) => {
                let url = '/tasks';
                if (projectId) url += `?projectId=${projectId}`;
                return url;
            },
            providesTags: ['Task'],
        }),
        createTask: builder.mutation<
            Task,
            {
                title: string;
                projectId: string;
                description?: string;
                assigneeId?: string | null;
                dueDate?: string | null;
            }
        >({
            query: (newTask) => ({
                url: '/tasks',
                method: 'POST',
                body: newTask,
            }),
            invalidatesTags: ['Task', 'Dashboard'],
        }),
        updateTaskStatus: builder.mutation({
            query: ({ taskId, status }) => ({
                url: `/tasks/${taskId}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Task', 'Dashboard'],
        }),
    }),
});

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskStatusMutation } = tasksApi;
