import React, { useState } from 'react';

type Props = {    
    onClickHandler: (value: string, type: string) => void;
    label: string;    
};

const Button = ({ label, onClickHandler }: Props) => {

  const [visible, setVisible] = useState(false);  

  const handleClick = () => {
    setVisible(true);
    onClickHandler(label, "someType");  // Pass the required values to onClickHandler
  };

  return (
    <div 
        className={`border border-[#c8ceed] px-[20px] py-[10px] rounded-[5px] hover:border-[#0a1551] text-[#6C73A8] hover:bg-[#dadef3] cursor-pointer ${ visible ? "bg-[#0f1430] text-white" : "bg-white"}`}
        onClick={handleClick}  // Call handleClick on click
    >
        <p className="font-bold leading-[28px]  text-[15px] break-all">{label}</p>
    </div>
  );
}

export default Button;
