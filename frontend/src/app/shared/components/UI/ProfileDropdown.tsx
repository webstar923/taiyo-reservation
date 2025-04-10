"use client"; // For Next.js 13+ (app directory)
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import HistoryIcon from '@/../public/assets/icons/history_icon.svg';
import LockIcon from '@/../public/assets/icons/lock_icon.svg';
import CardIcon from '@/../public/assets/icons/card_icon.svg';
import BellIcon from '@/../public/assets/icons/bell_icon.svg';
import PaintIcon from '@/../public/assets/icons/paint_icon.svg';
import DeleteIcon from '@/../public/assets/icons/delete_icon.svg';
import LogoutIcon from '@/../public/assets/icons/logout_icon.svg';

const ProfileDropdown = () =>{

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isOpenProfile,setIsOpenProfile] = useState(false);
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpenProfile(false);
      }
      
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);
  return (
    <div
      ref={dropdownRef}
      className="flex justify-end"
    >
      <div 
          className="w-[92px] px-[8px] py-[4px] flex items-center gap-[8px] rounded-[56px] shadow-[0px_0px_34px_0px_#0000001A]"
          onClick={()=>setIsOpenProfile(!isOpenProfile)}
        >
          <Image
              src="/assets/icons/dropdown_icon.svg"
              alt="dropdown"
              width={24}
              height={12}
          />
          <Image
              src="/assets/images/avatars/default.png"
              alt="avatar"
              width={48}
              height={48}
              className="rounded-[150px]"
          />
        </div>
        {
          isOpenProfile  &&
            <div className="absolute w-[300px] top-[60px] max-h-auto px-[12px] py-[20px] gap-[12px] rounded-[16px] bg-[#FFFFFF] shadow-[0px_14px_44px_0px_rgba(0,0,0,0.15)] overflow-y-auto mt-5 custom-scrollbar z-30">
              <div className="w-full py-1 flex gap-3 ">
                <Image
                src="/assets/images/avatars/default.png"
                alt="avatar"
                width={44}
                height={44}
                className="rounded-[150px]"
                />
                <div className="flex flex-col gap-[2px]">
                  <p className="font-medium text-[20px] text-[#212529] leading-[20px]">
                    Andy Anago
                  </p>
                  <p className="font-normal text-[16.4px] text-[#858688] leading-[20.4px] ">
                    User
                  </p>
                </div>              
              </div>
              <hr className="my-3 text-[#E3E3E3]"/>
              <div className="flex flex-col gap-3">
                <div className="flex px-3 py-1 gap-2 items-center cursor-pointer" onClick={()=>{router.push('/donation-history');}}>
                  <HistoryIcon className="w-4 h-4 flex justify-center items-center" />
                  <p className="font-normal text-[14px] leading-[18.2px] text-[#858688]">Donation History</p>
                </div>
                <hr className="text-[#E3E3E3]"/>
                <div className="flex px-3 py-1 gap-2 items-center cursor-pointer" onClick={()=>{router.push('/setting');}}>
                  <LockIcon className="w-4 h-4 flex justify-center items-center" />
                  <p className="font-normal text-[14px] leading-[18.2px] text-[#858688]">Change Password</p>
                </div>
                <div className="flex px-3 py-1 gap-2 items-center cursor-pointer" onClick={()=>{router.push('/setting');}}>
                  <CardIcon className="w-4 h-4 flex justify-center items-center" />
                  <p className="font-normal text-[14px] leading-[18.2px] text-[#858688]">Payment Method</p>
                </div>
                <div className="flex px-3 py-1 gap-2 items-center cursor-pointer" onClick={()=>{router.push('/setting');}}>
                  <BellIcon className="w-4 h-4 flex justify-center items-center" />
                  <p className="font-normal text-[14px] leading-[18.2px] text-[#858688]">Notification Preference</p>
                </div>
                <div className="flex px-3 py-1 gap-2 items-center cursor-pointer" onClick={()=>{router.push('/setting');}}>
                  <PaintIcon className="w-4 h-4 flex justify-center items-center" />
                  <p className="font-normal text-[14px] leading-[18.2px] text-[#858688]">Branding Details</p>
                </div>
              </div>

              <hr className="my-3 text-[#E3E3E3]"/>
              <div className="flex px-3 py-1 gap-2 items-center cursor-pointer mt-1" onClick={()=>{router.push('/setting');}}>
                <DeleteIcon className="w-4 h-4 flex justify-center items-center" />
                <p className="font-normal text-[14px] leading-[18.2px] text-[#858688]">Delete Account</p>
              </div>
              <div className="flex px-3 py-1 gap-2 items-center cursor-pointer mt-1" onClick={()=>{router.push('/setting');}}>
                <LogoutIcon className="w-4 h-4 flex justify-center items-center" />
                <p className="font-normal text-[14px] leading-[18.2px] text-[#858688]">Logout</p>
              </div>            
            </div>
        }
    </div>
  );
};

export default ProfileDropdown;
