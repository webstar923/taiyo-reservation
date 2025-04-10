import React from 'react';

const LeftImageContainer = () => {
  return (
    <div className="absolute inset-2 md:bg-[url('/assets/images/auth/auth_bg2.png')] bg-cover bg-no-repeat rounded-[10px]">
       <div className="absolute inset-0 rounded-[10px] bg-black opacity-25 w-full h-full"></div>
      <div className="absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center z-10">
        <p className="font-semibold text-[110px] mb-[60px] leading-[20px] tracking-[-0.05em] text-[#ff3131] drop-shadow-[3px_2px_6px_rgba(30,230,0,0.9)]">予約システム</p>
        <h1 className="flex items-center justify-center font-black text-[95px] leading-[48px] tracking-[-0.06em] text-center text-[#fff235] drop-shadow-[4px_2px_1px_rgba(230,30,10,0.5)]">Taiy<div className="w-14 h-14 rounded-full bg-[#ECF94B] border-[10px] border-[#ff3131] border-solid"></div>P.U.S</h1>
      </div>
    </div>
  )
}

export default LeftImageContainer;