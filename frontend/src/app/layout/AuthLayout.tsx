'use client';

import { ReactNode } from 'react';
import LeftImageContainer from '@/app/auth/components/LeftImageContainer';
type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
    <div className="auth relative min-h-screen flex flex-col bg-cover bg-no-repeat sm:flex-row">

      {/* Background - Fixed position */}
      <div className="fixed inset-0 bg-[url('/assets/images/Mask_pattern.png')] bg-cover bg-no-repeat opacity-[10%] pointer-events-none z-[-1]"></div>
      
      {/* Left Side - Image */}
      <div className="sticky top-0 flex-1 flex justify-center items-center hidden md:block md:h-[100vh] w-[10px]">
        <LeftImageContainer />
      </div>

      {/* Right Side - Dynamic Content */}
      <div className="relative flex-1 flex justify-center w-full mx-auto md:my-0 mt-0 overflow-y-auto">
        {children}
      </div> 
      
    </div>
    
    </>
  );
};

export default AuthLayout;
