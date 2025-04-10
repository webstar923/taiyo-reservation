import { ReactNode, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/app/layout/Sidebar";
import BellIcon from "@public/assets/icons/notification-01.svg";
import { useDashboard } from "@/hooks/useDashboard";
import { useNotificationData } from '@/state/notificationNum';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const {NotificationNum}= useNotificationData();

  const { getNotificationNum } = useDashboard(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
         await getNotificationNum();
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row bg-gray-900">
      <Sidebar />
      <div className="flex-1 bg-gray-900">
        <div className="flex w-full bg-gray-900 border-[#414141] py-[10px] px-[30px] justify-between">
          <div className="flex py-2 items-center gap-2">
            {/* <img src="/assets/images/auth/logo2.png" alt="logo" className="h-[20px]" />
            <p className="font-bold text-[20px] text-white">Full Value</p> */}
          </div>
          <div className="flex items-center gap-3 py-2">
            {/* <div className="relative cursor-pointer border-[2px] hover:border-[#B5B5B5] rounded-[5px]">
              <Link href="/dashboard/message" className="flex items-center">
                <MessageIcon className="w-[30px] h-[30px]" />
                <div className="absolute rounded-[5px] bg-[#3134a8] bottom-[-6px] right-[0px] text-white px-1.5 py-[2px] border-[1px] border-[#f2f2f2]">
                  <p className="text-[10px]">{infoLogNum}</p>
                </div>
              </Link>
            </div> */}
            <div className="relative cursor-pointer hover:border-[1px] border-[#B5B5B5] rounded-[5px]">
              <Link href="/dashboard/notification" className="flex items-center">
                <BellIcon className="w-[40px] h-[40px]" />
                {NotificationNum.Notification_Num !==0 && (
                  <div className="absolute rounded-[5px] bg-[#b92626] bottom-[-6px] right-[0px] text-white px-1.5 py-[2px] border-[1px] border-[#f2f2f2]">
                    <p className="text-[10px]">{NotificationNum.Notification_Num}</p>
                  </div>
                  )
                }
              </Link>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};



export default DashboardLayout;
