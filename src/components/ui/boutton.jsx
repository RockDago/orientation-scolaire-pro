import React from "react";

const cx = (...parts) => parts.filter(Boolean).join(" ");

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-black transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

const sizeStyles = {
  sm: "px-4 py-2.5 text-xs sm:text-sm rounded-full",
  md: "px-5 py-3 text-sm sm:text-base rounded-full",
  lg: "px-6 py-3.5 sm:py-4 text-[clamp(0.8rem,1vw,1rem)] rounded-full",
  icon: "w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0",
};

const variantStyles = {
  primary: "bg-[#1250c8] text-white hover:bg-[#1a3ea8] shadow-lg hover:shadow-xl hover:-translate-y-0.5",
  ghost: "bg-black/10 text-white hover:text-white/80 backdrop-blur-sm shadow-lg",
  chip: "border border-white/40 bg-white/10 text-white hover:bg-white/25 font-semibold",
  chipActive: "border border-white bg-white text-[#1250c8] shadow-lg font-semibold",
  soft: "bg-white/20 text-white/40",
};

export default function Boutton({
  children,
  className = "",
  variant = "primary",
  size = "lg",
  fullWidth = false,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cx(
        baseStyles,
        sizeStyles[size] || sizeStyles.lg,
        variantStyles[variant] || variantStyles.primary,
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
