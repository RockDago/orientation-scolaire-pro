import React from "react";

const cx = (...parts) => parts.filter(Boolean).join(" ");

const baseStyles =
  "w-full bg-white border border-slate-200 text-slate-800 outline-none transition-all duration-200";

const sizeStyles = {
  sm: "min-h-10 px-3 text-xs sm:text-sm rounded-xl",
  md: "min-h-11 px-3.5 text-sm rounded-xl",
  lg: "min-h-[50px] px-4 text-[clamp(0.7rem,0.9vw,0.85rem)] rounded-2xl",
};

export default function Input({
  className = "",
  size = "lg",
  type = "text",
  ...props
}) {
  return (
    <input
      type={type}
      className={cx(
        baseStyles,
        sizeStyles[size] || sizeStyles.lg,
        "focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]",
        className
      )}
      {...props}
    />
  );
}
