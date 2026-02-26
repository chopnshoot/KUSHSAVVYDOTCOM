import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { width: 40, height: 16 },
  md: { width: 50, height: 20 },
  lg: { width: 70, height: 28 },
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
