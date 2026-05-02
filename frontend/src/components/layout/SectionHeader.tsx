import type { ReactNode } from 'react';

export interface SectionHeaderProps {
    title: string;
    action?: ReactNode;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{title}</h2>
            {action && <div>{action}</div>}
        </div>
    );
}
