import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../store/store';
import { logout } from '../auth/authSlice';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithLogout = async (
    args: Parameters<typeof rawBaseQuery>[0],
    api: Parameters<typeof rawBaseQuery>[1],
    extraOptions: Parameters<typeof rawBaseQuery>[2]
) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
        api.dispatch(logout());
        api.dispatch({ type: 'api/resetApiState' });
    }
    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithLogout,
    tagTypes: ['Task', 'Project', 'Dashboard'],
    endpoints: () => ({}),
});
