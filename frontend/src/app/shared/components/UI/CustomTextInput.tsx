import React, { ChangeEvent } from 'react';

type Props = {
  value: string;
  onChangeHandler: (value: string) => void;
  error?: string; // Optional error message for validation
  label?: string; // Label text for the input field
  placeholder: string; // Placeholder text for the input field
  id: string; // Unique id for each input field
  autoComplete?: string; // Set autocomplete label if exists
};

const CustomTextInput = ({
  value,
  onChangeHandler,
  error,
  label,
  placeholder,
  id,
  autoComplete,
}: Props) => {
  // Handle onChange for the textarea field
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChangeHandler(e.target.value);
  };

  return (
    <div className="relative w-full mb-4">
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="text-[16px] font-medium leading-[16px] tracking-[-0.03em] mb-2 block"
        >
          {label}
        </label>
      )}

      {/* Textarea */}
      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        required
        className={`w-full h-31 p-4 rounded-md bg-light-gray border mt-1 resize-none ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        aria-describedby={`${id}-error`} // Referencing error ID for accessibility
        {...(autoComplete && { autoComplete })}
      />

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm mt-1" id={`${id}-error`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default CustomTextInput;
