interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { width: 120, height: 28, fontSize: 18, letterSpacing: 4 },
  md: { width: 160, height: 36, fontSize: 24, letterSpacing: 5 },
  lg: { width: 220, height: 48, fontSize: 32, letterSpacing: 6 },
};

export default function Logo({ className, variant = "dark", size = "md" }: LogoProps) {
  const { width, height, fontSize, letterSpacing } = sizes[size];
  const color = variant === "dark" ? "#2D6A4F" : "#FFFFFF";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="KushSavvy"
      role="img"
    >
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={color}
        fontFamily="'Fraunces', Georgia, serif"
        fontWeight="700"
        fontSize={fontSize}
        letterSpacing={letterSpacing}
      >
        KUSH SAVVY
      </text>
    </svg>
  );
}
