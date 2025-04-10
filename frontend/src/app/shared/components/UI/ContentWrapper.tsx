import React from 'react';
import clsx from 'clsx';

interface ContentWrapperProps {
  children: React.ReactNode;
  className?: string; // Optional className prop
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children, className }) => {
  return (
    <div className={clsx("bg-white p-[20px] md:rounded-[14px] md:ml-[30px] md:mr-[30px] mb-[24px] sm:mb-[20px]", className)}>
      {children}
    </div>
  )
}

export default ContentWrapper;
