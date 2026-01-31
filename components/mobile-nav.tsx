"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/lib/language-context";
import { companyLinks, companyLinks2, productLinks } from "@/components/nav-links";
import { LinkItem } from "@/components/shared";
import { LanguageSelectorDropdown } from "@/components/language-selector-dropdown";
import { ThemeTabs } from "@/components/theme-tabs";

export function MobileNav() {
	const [open, setOpen] = React.useState(false);
	const { isMobile } = useMediaQuery();
	const { t } = useLanguage();

	// 🚫 Disable body scroll when open
	React.useEffect(() => {
		if (open && isMobile) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		// Cleanup on unmount too
		return () => {
			document.body.style.overflow = "";
		};
	}, [open, isMobile]);

	return (
		<>
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				className="md:hidden"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="outline"
			>
				<div
					className={cn(
						"transition-all",
						open ? "scale-100 opacity-100" : "scale-0 opacity-0"
					)}
				>
					<XIcon aria-hidden="true" className="size-4.5" />
				</div>
				<div
					className={cn(
						"absolute transition-all",
						open ? "scale-0 opacity-0" : "scale-100 opacity-100"
					)}
				>
					<MenuIcon aria-hidden="true" className="size-4.5" />
				</div>
			</Button>
			{open &&
				createPortal(
					<div
						className={cn(
							"bg-white dark:bg-zinc-950",
							"fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-t md:hidden"
						)}
						id="mobile-menu"
					>
						<div
							className={cn(
								"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
								"size-full overflow-y-auto overflow-x-hidden p-4"
							)}
							data-slot={open ? "open" : "closed"}
						>
							{/* Language + Theme Row - At Top */}
							<div className="mb-4 flex items-center justify-between gap-2 pb-3 border-b">
								<LanguageSelectorDropdown />
								<ThemeTabs />
							</div>
							
							<div className="flex w-full flex-col gap-y-2">
								<span className="text-sm">{t('nav.product')}</span>
								{productLinks.map((link) => (
									<LinkItem key={`product-${link.labelKey}`} {...link} />
								))}
								<span className="text-sm">{t('nav.company')}</span>
								{companyLinks.map((link) => (
									<LinkItem key={`company-${link.labelKey}`} {...link} />
								))}
								{companyLinks2.map((link) => (
									<a
										key={`company2-${link.labelKey}`}
										href={link.href}
										className="flex items-center gap-x-2 rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
									>
										<link.icon className="size-4" />
										<span>{t(`company.${link.labelKey}`)}</span>
									</a>
								))}
							</div>
							<div className="mt-2 flex flex-col gap-2">
								{/* Action Buttons */}
								<Button 
									className="w-full border-black dark:border-white text-black dark:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800" 
									variant="outline"
								>
									{t('buttons.signIn')}
								</Button>
								<Button className="w-full bg-blue-600 text-white dark:bg-blue-700 dark:text-white hover:bg-blue-700 dark:hover:bg-blue-800">
									{t('buttons.getStarted')}
								</Button>
							</div>
						</div>
					</div>,
					document.body
				)}
		</>
	);
}
