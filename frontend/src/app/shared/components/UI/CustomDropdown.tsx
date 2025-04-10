"use client"; // For Next.js 13+ (app directory)
import { useState, useEffect, useRef } from "react";
import SortIcon from "@/../../public/assets/icons/sort.svg";
import ArrowDownIcon from '@/../../public/assets/icons/arrow-down.svg';

type CustomDropdownProps = {
  options?: string[]; // Array of string options
  label?: string;
  className?: string;
  defaultValue?: string; // Default selected value
  onChange?: (value: string) => void; // Callback for value change
  canCollapse?: boolean; // Whether or not can collapse
};

const CustomDropdown = ({
  options = [],
  label = "Sort by",
  defaultValue = "",
  onChange,
  canCollapse = false,
  className =""
}: CustomDropdownProps) => {
  const [selectedValue, setSelectedValue] = useState<string>(
    defaultValue || options[0] || ""
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const CustomdropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle selection
  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onChange) onChange(value); // Notify parent component
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        CustomdropdownRef.current &&
        !CustomdropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
      
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div
      ref={CustomdropdownRef}
      className={`relative flex items-center sm:bg-gray-100 sm:pl-2 sm:rounded-lg ${className}`}
    >
      {/* Mobile View - Sort Icon Only */}
      {canCollapse ? (
        <button
          onClick={toggleDropdown}
          className="sm:hidden flex items-center justify-center p-2 rounded-lg !bg-black text-gray-700 hover:bg-gray-300 border border-gray-300"
        >
          <SortIcon className="w-4 h-4" />
        </button>
      ) : null}

      {/* Desktop View - Label and Dropdown */}
      <div className={`flex items-center w-full ${canCollapse ? "hidden sm:flex" : ""}`}>
        <span className="text-[#858688] font-semibold text-[14px] leading-[17.85px] mr-2">{label}:</span>
        <button
          className="flex justify-between items-center px-1 rounded-md bg-gray-100 text-gray-700"
          onClick={toggleDropdown}
        >
          <span>{selectedValue}</span>
          <ArrowDownIcon className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[2rem] right-0 mt-1 sm:w-full w-[13.3rem] bg-white border border-gray-200 rounded-md shadow-lg z-20">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700 text-[#091428]"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
