import React from 'react';

type Props = {
  icon: React.ReactNode; // to handle any React node, such as an SVG or icon component
  label: string;         // for the text label
  isActive?: string;      // for activating button
  onClick: () => void;   // a function to handle button clicks
}

const SecondaryButton = ({ icon, label, isActive, onClick} : Props) => {
  return (
    <button 
      className="flex items-center bg-[#f5f5f5] hover:bg-gray-300 p-2 px-4 rounded-[7px]"
      onClick={onClick}
    >
      {icon}
      <p className="ml-1 text-[14px] sm:text-[16px]">{label}</p>
    </button>
  )
}

export default SecondaryButton;
