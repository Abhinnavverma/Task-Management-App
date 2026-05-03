import { apiSlice } from '../api/api';

interface AuthResponse {
    token: string;
    user: { id: string; name: string; email: string; role: string };
}

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, { email: string; password: string }>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<AuthResponse, { name: string; email: string; password: string }>(
            {
                query: (userData) => ({
                    url: '/auth/register',
                    method: 'POST',
                    body: userData,
                }),
            }
        ),
    }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
