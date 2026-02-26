import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { width: 28, height: 11 },
  md: { width: 38, height: 15 },
  lg: { width: 58, height: 23 },
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
