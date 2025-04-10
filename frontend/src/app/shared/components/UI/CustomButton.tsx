import React from "react";
import clsx from "clsx"; // Optional: Install via `npm install clsx`

type Props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Optional click handler
  isLoading?: boolean; // Indicates loading state
  label: string; // Button text
  icon?: React.ReactNode; // Optional icon to show when not loading
  beforeIcon?: boolean; // Optional icon position
  loadingIcon?: string; // Icon to display during loading
  type?: "button" | "submit" | "reset"; // Button type (defaults to "button")
  disableLoading?: boolean; // Skip loading behavior
  disabled?: boolean; // Disable button state
  backgroundImage?: string; // Optional background image
  className?: string; // Additional class name
  labelClass?: string;
};

const CustomButton: React.FC<Props> = ({
  onClick,
  isLoading = false,
  label,
  icon,
  beforeIcon = false,
  loadingIcon = "loading",
  type = "button", // Default to "button"
  disableLoading = false,
  disabled = false,
  backgroundImage,
  className,
  labelClass,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || (isLoading && !disableLoading)}
      aria-disabled={disabled || (isLoading && !disableLoading)} // Accessibility
      aria-busy={isLoading} // Accessibility for loading state
      className={` flex items-center justify-center gap-2 text-white rounded-xl bg-[#00b900] shadow-[0px_4px_14px_0px_#00000040] font-medium focus:outline-none  p-[12px_20px] ${className}   ${
          disabled ? "cursor-not-allowed opacity-70" : ""
        }`}
     
   
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    >
      {/* Render loading state */}
      {!disableLoading && isLoading ? (
        <span className={`flex items-center text-[26px] font-normal leading-[16px] tracking-[-0.05em] ${labelClass}`}>
          {`${label}...`}
          {loadingIcon && (
            <img
              src={`/assets/icons/${loadingIcon}.svg`}
              alt="Loading"
              className="w-6 h-6 ml-2 animate-spin"
            />
          )}
        </span>
      ) : (
        <span className="flex items-center text-[16px] font-normal leading-[16px] tracking-[-0.05em]">
          {beforeIcon && icon && icon}
          <span className={`text-base ${labelClass} ${beforeIcon ? "ml-2" : ""}`}>{label}</span>
          {!beforeIcon && icon && icon}
        </span>
      )}
    </button>
  );
};

export default CustomButton;
