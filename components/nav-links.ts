import {
	BarChart,
	FileText,
	GlobeIcon,
	LayersIcon,
	RotateCcw,
	Shield,
	Users,
} from "lucide-react";
import type { LinkItemType } from "@/components/shared";

export const productLinks: LinkItemType[] = [
	{
		labelKey: "websiteBuilder",
		href: "#",
		descriptionKey: "websiteBuilder",
		icon: GlobeIcon,
		type: "product",
	},
	{
		labelKey: "cloudPlatform",
		href: "#",
		descriptionKey: "cloudPlatform",
		icon: LayersIcon,
		type: "product",
	},
	{
		labelKey: "analytics",
		href: "#",
		descriptionKey: "analytics",
		icon: BarChart,
		type: "product",
	},
];

export const companyLinks: LinkItemType[] = [
	{
		labelKey: "aboutUs",
		href: "/about",
		descriptionKey: "aboutUs",
		icon: Users,
		type: "company",
	}
];

export const companyLinks2 = [
	{
		labelKey: "terms",
		href: "#",
		icon: FileText,
	},
	{
		labelKey: "privacy",
		href: "#",
		icon: Shield,
	},
	{
		labelKey: "refund",
		href: "#",
		icon: RotateCcw,
	},
];
