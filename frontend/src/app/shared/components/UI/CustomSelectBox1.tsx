import React, { ChangeEvent, useEffect, useState, useRef } from 'react';
import CheckedIcon from '@/../../public/assets/icons/checked_icon.svg';
import UncheckedIcon from '@/../../public/assets/icons/unchecked_icon.svg';


type Option = {
  category: string;
  icon: string;
  professions: string[];
};

type Props = {
  onClickHandler: (value: string) => void;
  onCheckHandler: (value: string) => void;
  error?: string; // Optional error message for validation
  label?: string; // Label text for the select box
  placeholder?: string; // Placeholder text for the select box
  id: string; // Unique id for each select box
  options: Option[]; // Options for the select dropdown
  icon?: string; // Icon name to show (e.g., 'dropdown', etc.)
  iconVisible?: boolean; // Flag to show or hide the icon
  category?: string;
  profession?: string;
};
const CustomSelectBox = ({
  onClickHandler,
  onCheckHandler,
  error,
  label,
  placeholder = 'Select an option',
  id,
  options,
  icon,
  iconVisible = true,
  category,
  profession,
}: Props) => {
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const getIconByCategory = (categoryName: string) => {
    // Find the matching entry
    const item = options.find(
      (entry) =>
        entry.category &&
        entry.category.toLowerCase() === categoryName.toLowerCase()
    );
  
    // Return the icon if found, otherwise return a fallback
    return item && item.icon ? item.icon : 'default-icon';
  };
  return (
    <div className="relative w-full  mb-4" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="block text-[16px] font-medium leading-[16px] tracking-[-0.03em] mb-2"
        >
          {label}
        </label>
      )}

      {/* Select Field */}
      <div className="relative w-full">
        <div
          id={id}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full py-4 px-4 pr-10 rounded-[6px] bg-light-gray border mt-1 appearance-none ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-describedby={`${id}-error`}
        >
          {
            category ? (
              <div>
                <div className="flex items-center gap-2">
                  <img
                    src={`/assets/icons/profession_icon/${getIconByCategory(category)}.svg`}
                    alt={category}
                    className="w-4 h-4"
                  />
                  <p className="text-4 font-medium leading-4 tracking-[-0.03em] text-[#091428]">
                    {category}
                  </p>
                </div>
                {profession && (
                  <p className="text-3 font-normal leading-4 tracking-[-0.03em] text-[#091428] mt-2">
                    {profession}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-4 font-normal leading-4 text-[#858688] select-none">
                {placeholder}
              </p>
            )
          }
        </div>
        {/* Dropdown Icon */}
        {iconVisible && icon && (
          <img
            src={`/assets/icons/${icon}.svg`}
            alt={icon}
            className={`absolute h-3 w-6 top-1/2 right-4 transform -translate-y-1/2 cursor-pointer transition-transform duration-500 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        )}
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute w-full max-h-[50vh] p-3 gap-[10px] rounded-[10px] bg-[#FFFFFF] shadow-[0px_14px_44px_0px_rgba(0,0,0,0.15)] overflow-y-auto custom-scrollbar z-10">
          {options.map((option,optionIndex) => (
            <div 
              key={`${option.category}-${optionIndex}`}
              className={`gap-4 rounded-[5px] cursor-pointer transition-colors duration-200 ${
              option.category === category ? 'bg-[#F5F5F5]' : 'hover:bg-[#F5F5F5]'
              }`}
            >
              <div
                className="p-[9px_10px]"              
                onClick={() => {
                  onClickHandler(option.category);
                  onCheckHandler(''); 
                }}
              >
                {/* Main Category Item */}
                <div className="gap-[10px] flex justify-start" >
                  <img
                    src={`/assets/icons/profession_icon/${option.icon}.svg`}
                    alt={option.icon}
                    className="w-4 h-4"
                  />
                  <p className="text-[14px] font-medium leading-[14px] tracking-[-0.03em] text-[#091428] select-none">
                    {option.category}
                  </p>
                </div>
              </div>
              {/* Professions Sub-List */}
              {option.category === category &&
                option.professions.map((professionItem, professionIndex) => (
                <div
                  key={`${professionItem}-${professionIndex}`}
                  className="p-[8px_10px] gap-[10px] flex justify-start"
                  onClick={() => {
                    onCheckHandler(professionItem); // Set selected profession
                    setIsOpen(false);
                  }}
                >
                  {
                    profession === professionItem 
                    ? (
                      <CheckedIcon className="w-3 h-3" />
                    ) : (
                      <UncheckedIcon className="w-3 h-3" />
                    )
                  }
                  <p className="text-[14px] font-medium leading-[14px] tracking-[-0.03em] text-[#091428] select-none">
                    {professionItem}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}


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
