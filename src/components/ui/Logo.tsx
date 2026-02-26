interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-base tracking-widest",
  md: "text-xl tracking-widest",
  lg: "text-2xl tracking-widest",
};

export default function Logo({ className, variant = "dark", size = "md" }: LogoProps) {
  const colorClass = variant === "dark" ? "text-accent-green" : "text-white";

  return (
    <span
      className={`inline-block whitespace-nowrap font-heading font-bold ${sizeClasses[size]} ${colorClass} ${className || ""}`}
      aria-label="KushSavvy"
    >
      KUSH SAVVY
    </span>
  );
}
