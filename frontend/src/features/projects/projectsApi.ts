import type { Project } from '@/types/models';
import { apiSlice } from '../api/api';

export const projectsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProjects: builder.query<Project[], void>({
            query: () => '/projects',
            providesTags: ['Project'],
        }),
        createProject: builder.mutation<Project, { name: string; description?: string }>({
            query: (newProject) => ({
                url: '/projects',
                method: 'POST',
                body: newProject,
            }),
            invalidatesTags: ['Project'],
        }),
    }),
});

export const { useGetProjectsQuery, useCreateProjectMutation } = projectsApi;
