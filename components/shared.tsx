"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export type LinkItemType = {
	labelKey: string;
	href: string;
	icon: LucideIcon;
	descriptionKey?: string;
	type?: 'product' | 'company';
};

export function LinkItem({
	labelKey,
	descriptionKey,
	icon: Icon,
	className,
	href,
	type = 'product',
	...props
}: React.ComponentProps<"a"> & LinkItemType) {
	const { t } = useLanguage();

	return (
		<a
			className={cn("flex gap-x-2 rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800", className)}
			href={href}
			{...props}
		>
			<div className="flex aspect-square size-12 items-center justify-center rounded-md border bg-card text-sm shadow-sm">
				<Icon className="size-5 text-foreground" />
			</div>
			<div className="flex flex-col items-start justify-center">
				<span className="font-medium">{t(`${type}.${labelKey}.title`)}</span>
				{descriptionKey && (
					<span className="line-clamp-2 text-muted-foreground text-xs">
						{t(`${type}.${labelKey}.description`)}
					</span>
				)}
			</div>
		</a>
	);
}
