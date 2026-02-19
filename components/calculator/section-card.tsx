import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionCardProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

export function SectionCard({ icon, title, children }: SectionCardProps) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3 pt-5">
                <CardTitle className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-blue-600">{icon}</span>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pb-5">{children}</CardContent>
        </Card>
    );
}
