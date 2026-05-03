import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useLoginMutation, useRegisterMutation } from './authApi';
import { setCredentials } from './authSlice';
import { apiSlice } from '../api/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { isApiError } from '@/lib/utils';

// Zod Schemas (Mirroring your backend)
const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AuthPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login] = useLoginMutation();
    const [register] = useRegisterMutation();
    const [errorMsg, setErrorMsg] = useState('');

    const loginForm = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const registerForm = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '' },
    });

    const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
        try {
            const result = await login(data).unwrap();
            dispatch(setCredentials({ user: result.user, token: result.token }));
            // Clear any cached API state so previous session data doesn't linger
            dispatch(apiSlice.util.resetApiState());
            navigate('/dashboard');
        } catch (err: unknown) {
            if (isApiError(err)) {
                setErrorMsg(err.data.error);
            } else {
                setErrorMsg('Failed to login');
            }
        }
    };

    const onRegisterSubmit = async (data: z.infer<typeof registerSchema>) => {
        try {
            const result = await register(data).unwrap();
            dispatch(setCredentials({ user: result.user, token: result.token }));
            // Clear stale cache after register/login
            dispatch(apiSlice.util.resetApiState());
            navigate('/dashboard');
        } catch (err) {
            if (isApiError(err)) {
                setErrorMsg(err.data.error);
            } else {
                setErrorMsg('Failed to register');
            }
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <Card className="w-96">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Task Manager</CardTitle>
                    <CardDescription>Sign in to manage your projects</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>

                        {errorMsg && (
                            <div className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600 text-center">
                                {errorMsg}
                            </div>
                        )}

                        <TabsContent value="login">
                            <form
                                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        {...loginForm.register('email')}
                                    />
                                    {loginForm.formState.errors.email && (
                                        <span className="text-xs text-red-500">
                                            {loginForm.formState.errors.email.message}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password">Password</Label>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        {...loginForm.register('password')}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Sign In
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form
                                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="reg-name">Full Name</Label>
                                    <Input id="reg-name" {...registerForm.register('name')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-email">Email</Label>
                                    <Input
                                        id="reg-email"
                                        type="email"
                                        {...registerForm.register('email')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-password">Password</Label>
                                    <Input
                                        id="reg-password"
                                        type="password"
                                        {...registerForm.register('password')}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Create Account
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
