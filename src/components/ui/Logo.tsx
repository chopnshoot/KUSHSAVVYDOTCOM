interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-lg tracking-[0.25em]",
  md: "text-2xl tracking-[0.3em]",
  lg: "text-3xl tracking-[0.35em]",
};

export default function Logo({ className, variant = "dark", size = "md" }: LogoProps) {
  const colorClass = variant === "dark" ? "text-accent-green" : "text-white";

  return (
    <span
      className={`font-heading font-bold ${sizeClasses[size]} ${colorClass} ${className || ""}`}
      aria-label="KushSavvy"
    >
      KUSH SAVVY
    </span>
  );
}
