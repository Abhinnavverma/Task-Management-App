import type { DashboardStats } from '@/types/models';
import { apiSlice } from '../api/api';

export const dashboardApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query<DashboardStats, void>({
            query: () => '/dashboard/stats',
            providesTags: ['Dashboard', 'Task'],
        }),
    }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
