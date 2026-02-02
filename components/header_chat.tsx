"use client";
import { useScroll } from "@/hooks/use-scroll";


import { cn } from "@/lib/utils";
import { ThemeTabs } from "@/components/theme-tabs";

export function Header() {
	const scrolled = useScroll(10);

	return (
		<header
			suppressHydrationWarning
			className={cn(
				"sticky top-0 z-50 w-full border-b bg-white dark:bg-zinc-950 dark:border-zinc-800",
				{
					"shadow-sm": scrolled,
				}
			)}
		>
			<nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
				<div className="flex items-center gap-8">
				</div>
				<div className="hidden items-center gap-4 md:flex">
					<ThemeTabs />
				</div>
			</nav>
		</header>
	);
}
