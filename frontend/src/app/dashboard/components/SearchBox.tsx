import React, { ChangeEvent } from 'react';

type Props = {
  value: string;
  onChangeHandler: (value: string) => void;
  placeholder: string; // Placeholder text for the input field
  type?: 'search'; // Flexible for different types of input
  id: string; // Unique id for each input field
  icon?: React.ReactNode; // Icon name to show (e.g., 'eye', 'search', etc.)
  autoComplete?: string; // Set autocomplete label if exists
};

const SearchBox = ({ 
  value, 
  onChangeHandler, 
  placeholder, 
  type = 'search',
  id,
  icon,
  autoComplete
}: Props) => {
  // Handle onChange for the input field
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeHandler(e.target.value);
  };

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        value={value}
        onChange={handleChange}
        className={`w-full p-2 pl-9 bg-light-gray rounded-md`}
        placeholder={placeholder}
        {...(autoComplete && { autoComplete })}
      />

      {icon}
{/* 
      <img 
        src={`/assets/icons/${icon}.svg`} 
        alt={icon}
        className="absolute top-[12px] left-[12px]"
      /> */}
    </div>
  );
};

export default SearchBox;
