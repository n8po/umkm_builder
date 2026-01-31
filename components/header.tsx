"use client";
import Link from "next/link";
import { useScroll } from "@/hooks/use-scroll";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

import { cn } from "@/lib/utils";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { LanguageSelectorDropdown } from "@/components/language-selector-dropdown";
import { ThemeTabs } from "@/components/theme-tabs";

export function Header() {
	const scrolled = useScroll(10);
	const { t } = useLanguage();

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
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<div className="flex items-center gap-5">
					<Link 
						className="rounded-md px-3 py-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" 
						href="/"
					>
						<Logo className="h-4" />
					</Link>
					<DesktopNav />
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<LanguageSelectorDropdown />
					<ThemeTabs />
					<Button 
						variant="outline" 
						className="border-black dark:border-white text-black dark:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
					>
						{t('buttons.signIn')}
					</Button>
					<Button className="bg-blue-600 text-white dark:bg-blue-700 dark:text-white hover:bg-blue-700 dark:hover:bg-blue-800">
						{t('buttons.getStarted')}
					</Button>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
}
