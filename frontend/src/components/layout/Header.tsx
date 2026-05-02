import { ReactNode } from 'react';

export interface HeaderProps {
    title: string;
    subtitle?: ReactNode;
    action?: ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
    return (
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {subtitle && <div className="text-gray-500 mt-1">{subtitle}</div>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
