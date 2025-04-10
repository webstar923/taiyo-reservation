import React from 'react'

type Props = {
  icon: React.ReactNode; // to handle any React node, such as an SVG or icon component
  label: string;         // for the text label
  isActive: string;      // for activating button
  onClick: () => void;   // a function to handle button clicks
}

const FunctionalButton = ({ icon, label, isActive, onClick }: Props) => {
  // Check if the button is active based on label matching isActive
  const isButtonActive = isActive === label;

  return (
    <button 
      onClick={onClick}
      className={`p-3 sm:pt-[20px] sm:pr-[18px] sm:pb-[20px] sm:pl-[18px] rounded-lg w-[120px] sm:w-[180px] text-left 
        ${isButtonActive ? 'bg-[#858688]' : 'bg-gray-100'} 
        transition-colors duration-200 ease-in-out`}
    >
      <div
        className="icon-wrapper scale-66 sm:scale-100"
      >
        {icon}
      </div>
      <p className={`pt-3 text-sm sm:text-base font-medium leading-[16px] ${isButtonActive ? 'text-white' : 'text-gray-800'}`}>{label}</p>
    </button>
  )
}

export default FunctionalButton;
