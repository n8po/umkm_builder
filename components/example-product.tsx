"use client";

import Image from "next/image";

export type FeatureType = "food" | "fashion" | "service";

interface FeatureIllustrationProps {
  type: FeatureType;
  priority?: boolean;
  className?: string;
}

const sources: Record<FeatureType, string> = {
  food: "/assets/img/foodOrder.png?v=1",
  fashion: "/assets/img/fashionRetail.png?v=1",
  service: "/assets/img/serviceFreelance.png?v=1",
};

export function FeatureIllustration({
  type,
  priority = false,
  className = "",
}: FeatureIllustrationProps) {
  return (
    <Image
      src={sources[type]}
      alt={`${type} illustration`}
      width={512}
      height={512}
      sizes="(min-width: 768px) 160px, 40vw"
      quality={90}
      priority={priority}
      className={`
        w-full h-auto object-contain
        select-none pointer-events-none
        ${className}
      `}
    />
  );
}
