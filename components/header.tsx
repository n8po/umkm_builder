"use client";
import { useScroll } from "@/hooks/use-scroll";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

import { cn } from "@/lib/utils";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Header() {
	const scrolled = useScroll(10);
	const { t } = useLanguage();

	return (
		<header
			className={cn("sticky top-0 z-50 w-full border-transparent border-b", {
				"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50":
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<div className="flex items-center gap-5">
					<a className="rounded-md px-3 py-2.5 hover:bg-accent" href="#">
						<Logo className="h-4" />
					</a>
					<DesktopNav />
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<LanguageSwitcher />
					<ThemeToggle />
					<Button variant="outline">{t('buttons.signIn')}</Button>
					<Button>{t('buttons.getStarted')}</Button>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
}
