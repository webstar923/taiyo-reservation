import React from 'react';

type Props = {
  id: string;
  onChangeHandler: (value: boolean) => void; // Expecting a function that accepts a boolean value
  label: string;  // Label text for the input field
  isChecked: boolean; // The state of the checkbox (checked or unchecked)
  error?: string;
};

const CustomCheckbox = ({ id, label, isChecked, onChangeHandler, error }: Props) => {

  const handleCheckboxChange = () => {
    // Toggle the isChecked state and call the onChangeHandler with the new state
    onChangeHandler(!isChecked);
  };

  return (
    <>
      <div className="flex items-center mt-6">
        <input
          type="checkbox"
          id={id}
          className="appearance-none w-3.5 h-3.5 bg-white border border-gray-700 rounded checked:bg-black checked:border-black checked:after:content-['✔'] checked:after:block checked:after:text-white checked:after:scale-90 checked:after:text-center flex items-center justify-center"
          checked={isChecked} // Set the checkbox's checked state based on the prop
          onChange={handleCheckboxChange} // Trigger the change when the checkbox is clicked
        />
        <label 
          htmlFor={id}
          className="ml-1 cursor-pointer text-base font-normal text-gray-500"
          onClick={handleCheckboxChange} // Trigger checkbox change when the label is clicked
        >
          {label}
        </label>
        
      </div>
      <div>
      {/* Error message below the input */}
      {error && (
        <div className="text-red-500 text-sm mt-1" id={`${id}-error`}>
          {error}
        </div>
      )}
    </div>
    </>
  );
};

export default CustomCheckbox;
