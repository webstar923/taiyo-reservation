import React, { useCallback } from 'react';

type Props = {
  label: string; // The label for this switch
  activeValue: string; // The currently selected value in the parent
  onChange: (selectedValue: string) => void; // Callback to update the value in the parent
};

const CustomSwitch: React.FC<Props> = ({ label, activeValue, onChange }) => {
  const isActive = activeValue === label;

  // Memoize handleClick to prevent unnecessary re-renders
  const handleClick = useCallback((): void => {
    onChange(isActive ? '' : label); // Toggle between '' and the label
  }, [isActive, label, onChange]);

  return (
    <div
      className="flex items-center cursor-pointer"
      onClick={handleClick}
      aria-checked={isActive} // Add accessibility feature
      role="switch" // Define this as a switch for screen readers
    >
      {/* Switch Container */}
      <div
        className={`relative w-9 h-5 rounded-full transition-all duration-300 ${
          isActive ? 'bg-[#009efc]' : 'bg-gray-200'
        } flex items-center`}
      >
        {/* Circle */}
        <div
          className={`relative w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
            isActive ? 'translate-x-4' : 'translate-x-0'
          }`}
        >
          <div className="absolute w-6 h-6 rounded-full bg-[#dedede] mix-blend-multiply"></div>
        </div>

        {/* Inner Circle */}
        <div
          className={`absolute w-4 h-4 rounded-full transition-transform duration-300 ${
            isActive ? 'bg-[#f1f1f1] translate-x-4' : 'bg-black translate-x-0'
          } left-1`}
        ></div>
      </div>

      {/* Label */}
      <span className="ml-1 text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
};

export default CustomSwitch;
