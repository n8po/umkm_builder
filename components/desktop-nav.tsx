"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { productLinks, companyLinks, companyLinks2 } from "@/components/nav-links";
import { LinkItem } from "@/components/shared";

export function DesktopNav() {
	const { t } = useLanguage();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		React.startTransition(() => {
			setIsMounted(true);
		});
	}, []);

	if (!isMounted) {
		return <div className="hidden md:block w-64" />;
	}

	return (
		<NavigationMenu className="hidden md:flex">
			<NavigationMenuList className="gap-6">
				<NavigationMenuItem>
					<NavigationMenuTrigger className="bg-transparent">
						{t('nav.product')}
					</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1 pr-1.5 shadow-xl">
						<div className="grid w-lg grid-cols-2 gap-2 rounded-md border bg-popover p-2 shadow">
							{productLinks.map((item, i) => (
								<NavigationMenuLink
									asChild
									className="w-full flex-row gap-x-2"
									key={`item-${item.labelKey}-${i}`}
								>
									<LinkItem {...item} type="product" />
								</NavigationMenuLink>
							))}
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="bg-transparent">
						{t('nav.company')}
					</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1 pr-1.5 pb-1.5 shadow-xl">
						<div className="grid w-lg grid-cols-2 gap-2">
							<div className="space-y-2 rounded-md border bg-popover p-2 shadow">
								{companyLinks.map((item, i) => (
									<NavigationMenuLink
										asChild
										className="w-full flex-row gap-x-2"
										key={`item-${item.labelKey}-${i}`}
									>
										<LinkItem {...item} type="company" />
									</NavigationMenuLink>
								))}
							</div>
							<div className="space-y-2 p-3">
								{companyLinks2.map((item, i) => (
									<NavigationMenuLink
										className="flex items-center gap-x-2 rounded-md p-2 transition-colors hover:bg-blue-50 dark:hover:bg-zinc-800"
										href={item.href}
										key={`item-${item.labelKey}-${i}`}
									>
										<item.icon className="size-4 text-foreground" />
										<span className="font-medium text-sm">{t(`company.${item.labelKey}`)}</span>
									</NavigationMenuLink>
								))}
							</div>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuLink asChild className="px-4">
					<a className="rounded-md p-2 transition-colors hover:bg-blue-50 dark:hover:bg-zinc-800" href="#">
						{t('nav.pricing')}
					</a>
				</NavigationMenuLink>
								<NavigationMenuLink asChild className="px-4">
					<a className="rounded-md p-2 transition-colors hover:bg-blue-50 dark:hover:bg-zinc-800" href="#">
						{t('nav.ecosystem')}
					</a>
				</NavigationMenuLink>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
