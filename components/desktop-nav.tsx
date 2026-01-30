"use client";

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

	return (
		<NavigationMenu className="hidden md:flex">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="bg-transparent">
						{t('nav.product')}
					</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 dark:bg-background">
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
					<NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 pb-1.5 dark:bg-background">
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
										className="flex-row items-center gap-x-2"
										href={item.href}
										key={`item-${item.labelKey}-${i}`}
									>
										<item.icon className="size-4 text-foreground" />
										<span className="font-medium">{t(`company.${item.labelKey}`)}</span>
									</NavigationMenuLink>
								))}
							</div>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuLink asChild className="px-4">
					<a className="rounded-md p-2 hover:bg-accent" href="#">
						{t('nav.pricing')}
					</a>
				</NavigationMenuLink>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
