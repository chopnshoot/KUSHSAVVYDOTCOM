import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { width: 100, height: 40 },
  md: { width: 140, height: 56 },
  lg: { width: 180, height: 72 },
};

export default function Logo({ className, size = "md" }: LogoProps) {
  const { width, height } = sizeMap[size];

  return (
    <Image
      src="/kushsavvy-trans-logo-white.png"
      alt="KushSavvy"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
