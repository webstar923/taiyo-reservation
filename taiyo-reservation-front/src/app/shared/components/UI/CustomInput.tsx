import React, { ChangeEvent } from 'react';

type Props = {
  value: string;
  onChangeHandler: (value: string) => void;
  error?: string; // Optional error message for validation
  label?: string; // Label text for the input field
  placeholder: string; // Placeholder text for the input field
  type?: 'text' | 'email' | 'password' | 'search' | 'number' ; // Flexible for different types of input
  id: string; // Unique id for each input field
  icon?: string; // Icon name to show (e.g., 'eye', 'search', etc.)
  onIconClickHandler?: () => void; // Optional click handler for the icon
  iconVisible?: boolean; // Flag to show or hide the icon
  autoComplete?: string; // Set autocomplete label if exists
  disabled?: boolean;
};

const CustomInput = ({
  value,
  onChangeHandler,
  error,
  label,
  placeholder,
  type,
  id,
  icon,
  onIconClickHandler = () => {},
  iconVisible = false,
  autoComplete,
  disabled,
}: Props) => {
  // Handle onChange for the input field
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeHandler(e.target.value);
  };

  return (
    <div className="relative w-full mt-0 mb-4">
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="block text-[16px] font-medium leading-[16px] tracking-[-0.03em] mb-2"
        >
          {label}
        </label>
      )}

      {/* Input Field with Icon */}
      <div className="relative">
        <input
          type={type}
          id={id}
          value={value}
          onChange={handleChange}
          required
          disabled={disabled}
          className={`w-full py-4 px-4 pr-3 rounded-[6px] bg-light-gray border mt-1 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={placeholder}
          aria-describedby={`${id}-error`} // Referencing error ID for accessibility
          {...(autoComplete && { autoComplete })}
          
        />

        {/* Icon */}
        {iconVisible && icon && (
          <img
            src={`/assets/icons/${icon}.svg`}
            alt={icon}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
            onClick={() => onIconClickHandler && onIconClickHandler()}
          />
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm mt-1" id={`${id}-error`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default CustomInput;
