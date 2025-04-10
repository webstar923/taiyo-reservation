import React from 'react';
import SuccessIcon from "@/../../public/assets/icons/check_circle_icon.svg";
import ErrorIcon from "@/../../public/assets/icons/error_circle_icon.svg";
import WarningIcon from "@/../../public/assets/icons/warning_circle_icon.svg";

interface NotificationProps {
  notificationType: "success" | "error" | "warning";
  title: string;
  content: string;
}

const Notification: React.FC<NotificationProps> = ({ notificationType, title, content }) => {
  const Icon = 
    notificationType === "success" ? SuccessIcon :
    notificationType === "error" ? ErrorIcon :
    WarningIcon;

  return (
    <div className="flex items-center relative">
      <div 
        className="absolute h-[30px] w-[30px] bg-gray-400 rounded-full left-[-3px]"
        style={{
          mixBlendMode: "overlay",
          filter: "brightness(1.5) contrast(0.5)",
        }}
      />
      <div className="absolute left-[3px] h-[16px] w-[16px] bg-black rounded-full" />
      <Icon className="w-6 h-6 absolute" />
      <div className="message-content ml-[50px] mr-5">
        <h1 className="text-[13px] font-medium text-white sm:text-[17px]">{title}</h1>
        <p className="text-[12px] font-normal text-white sm:text-[13px]">{content}</p>
      </div>
    </div>
  );
};

export default Notification;