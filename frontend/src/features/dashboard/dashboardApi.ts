import type { DashboardStats, User } from '@/types/models';
import { apiSlice } from '../api/api';

export const dashboardApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query<DashboardStats, void>({
            query: () => '/dashboard/stats',
            providesTags: ['Dashboard', 'Task'],
        }),
        getUsers: builder.query<User[], void>({
            query: () => '/users',
        }),
    }),
});

export const { useGetDashboardStatsQuery, useGetUsersQuery } = dashboardApi;
