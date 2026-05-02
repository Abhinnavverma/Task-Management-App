import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface StatCardProps {
    title: string;
    value: ReactNode;
    valueClassName?: string;
}

export function StatCard({ title, value, valueClassName = 'text-3xl font-bold' }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-500">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className={valueClassName}>{value}</p>
            </CardContent>
        </Card>
    );
}
