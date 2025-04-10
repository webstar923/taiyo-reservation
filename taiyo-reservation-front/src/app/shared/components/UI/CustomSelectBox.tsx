import React, { ChangeEvent } from 'react';

type Props = {
  value: string;
  onChangeHandler: (value: string) => void;
  error?: string; // Optional error message for validation
  label?: string; // Label text for the select box
  placeholder: string; // Placeholder text for the select box
  id: string; // Unique id for each select box
  icon?: string; // Icon name to show (e.g., 'dropdown', etc.)
  onIconClickHandler?: () => void; // Optional click handler for the icon
  iconVisible?: boolean; // Flag to show or hide the icon
};

const CustomSelectBox = ({
  value,
  onChangeHandler,
  error,
  label,
  placeholder,
  id,
  icon,
  onIconClickHandler = () => {},
  iconVisible = true,
}: Props) => {
  // Handle onChange for the select field
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChangeHandler(e.target.value);
  };

  return (
    <div className="relative w-full mb-4">
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="block text-[16px] font-medium leading-[16px] tracking-[-0.03em] mb-2"
        >
          {label}
        </label>
      )}

      {/* Select Field with Icon */}
      <div className="relative w-full">
        <select
          id={id}
          value={value}
          onChange={handleChange}
          required
          className={`w-full py-4 px-4 pr-10 rounded-[6px] bg-light-gray border mt-1 appearance-none ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-describedby={`${id}-error`} // Referencing error ID for accessibility
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {/* Example Options (can be replaced dynamically) */}
          <option value="option1">France</option>
          <option value="option2">US</option>
        </select>

        {/* Icon */}
        {iconVisible && icon && (
          <img
            src={`/assets/icons/${icon}.svg`}
            alt={icon}
            className="absolute h-3 w-6 top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
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

export default CustomSelectBox;
