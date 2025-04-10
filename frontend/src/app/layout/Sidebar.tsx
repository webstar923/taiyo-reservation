'use client';

import { useEffect, useState } from 'react';

import { useLogout } from '@/hooks/useAuth';
import { useAlbumStore } from '@/state/albumStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import CollapseIcon from '@public/assets/icons/collapse.svg';
import DashboardIcon from '@public/assets/icons/dashboard.svg';

import LogoutIcon from '@public/assets/icons/logout.svg';
import AgendarIcon from '@public/assets/images/icon/agendar_icon.svg';
import CalendarIcon from '@public/assets/images/icon/calendar_icon.svg';
import BuildingIcon from '@public/assets/images/icon/building_icon.svg';
import ErrorIcon from '@public/assets/images/icon/error_icon.svg';
import FileIcon from '@public/assets/images/icon/file_icon.svg';
import HistoryIcon from '@public/assets/images/icon/history_icon.svg';
import ApiIcon from '@public/assets/images/icon/api_icon.svg';


const Sidebar = () => {
  const pathname = usePathname();
  const { mutate: logout } = useLogout();
  const { isSidebarOpen, toggleSidebar } = useAlbumStore();
  const [isListsCollapsed, setIsListsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleCollapseClick = () => {
    isMobile ? setIsListsCollapsed(!isListsCollapsed) : toggleSidebar();
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout(); // Trigger logout
  }; 

  return (
    <div
      className={`sticky top-0 z-30 bg-gray-800 transition-all sm:min-h-screen duration-100 border-r-[1px] h-fit  
        ${isSidebarOpen ? 'w-full md:w-64' : 'w-full md:w-20'} 
        ${!isMobile ? 'fixed ' : ''}`}
    >
      <div className="p-4">
        <div className={`flex justify-between items-center gap-10 mt-2 ${isMobile ? 'mb-1' : 'mb-5' } }`}>
          <div className="flex items-center">            
            {isSidebarOpen ? (
              <div className='flex justify-start items-center'>
                <img
                  src="/assets/images/auth/logo2.png"
                  alt="logo"
                  className="h-[40px] transition-all duration-100"
                />
              </div>
            ):(
              <img
              src="/assets/images/auth/logo2.png"
              alt="logo"
              className={`h-[40px] transition-all duration-100 ${isSidebarOpen ? 'mr-[12px]' : 'mr-0'}`}
            />
            )
            }
          </div>
          <div className={`${(!isSidebarOpen && !isMobile) ? 'sm:absolute sm:top-[90px] sm:left-[27px]':'sm:relative mb-10'}`}>
            <button className="" onClick={handleCollapseClick}>
              <CollapseIcon className="w-7 h-7" />
            </button>
          </div>
        </div>

        <ul
          className={`space-y-2 ${
            (isSidebarOpen ) ? ' block pt-2' : 'sm:absolute sm:top-[130px] hidden'
          } md:block md:space-y-4 transition-all duration-100`}
        >
          <li
            className={`${
              pathname === '/dashboard' ? 'bg-[#ff8892] text-white' : ''
            } rounded-lg p-3 hover:bg-[#ff8892] text-white transition-all duration-100`}
          >
            <Link href="/dashboard" className="flex items-center">
              <DashboardIcon className={`w-[18px] h-[18px] ${pathname === '/dashboard' && "text-[#FFFFFF]"}`} />
              {isSidebarOpen  && <span className={`ml-2 ${pathname === '/dashboard' && "text-[#FFFFFF]"}`}>ダッシュボード</span>}
            </Link>
          </li>
          <li
            className={`${
              pathname.startsWith('/dashboard/calendar') ? 'bg-[#ff8892] text-white' : ''
            } rounded-lg p-3 hover:bg-[#ff8892] text-white transition-all duration-100`}
          >
            <Link href="/dashboard/calendar" className="flex items-center">
              <CalendarIcon className={`w-[18px] h-[18px] ${pathname.startsWith('/dashboard/calendar') && "text-[#FFFFFF]"}`} />
              {(isSidebarOpen || isMobile) && <span className={`ml-2 ${pathname.startsWith('/dashboard/calendar') && "text-[#FFFFFF]"}`}>カレンダー</span>}
            </Link>
          </li>
          <li
            className={`${
              pathname.startsWith('/dashboard/flat') ? 'bg-[#ff8892] text-white' : ''
            } rounded-lg p-3 hover:bg-[#ff8892] text-white transition-all duration-100`}
          >
            <Link href="/dashboard/flat" className="flex items-center">
              <BuildingIcon className={`w-[18px] h-[18px] ${pathname.startsWith('/dashboard/flat') && "text-[#FFFFFF]"}`} />
              {(isSidebarOpen || isMobile) && <span className={`ml-2 ${pathname.startsWith('/dashboard/flat') && "text-[#FFFFFF]"}`}>物件一覧</span>}
            </Link>
          </li>
          <li
            className={`${
              pathname.startsWith('/dashboard/work') ? 'bg-[#ff8892] text-white' : ''
            } rounded-lg p-3 hover:bg-[#ff8892] text-white transition-all duration-100`}
          >
            <Link href="/dashboard/work" className="flex items-center">
              <AgendarIcon className={`w-[18px] h-[18px] ${pathname.startsWith('/dashboard/work') && "text-[#FFFFFF]"}`} />
              {(isSidebarOpen || isMobile) && <span className={`ml-2 ${pathname.startsWith('/dashboard/work') && "text-[#FFFFFF]"}`}>案件一覧</span>}
            </Link>
          </li>
                 
          <li
            className={`${
              pathname.startsWith('/dashboard/history') ? 'bg-[#ff8892] text-white' : ''
            } rounded-lg p-3 hover:bg-[#ff8892] text-white transition-all duration-100`}
          >
            <Link href="/dashboard/history" className="flex items-center">
              <HistoryIcon className={`w-[18px] h-[18px] ${pathname.startsWith('/dashboard/history') && "text-[#FFFFFF]"}`} />
              {(isSidebarOpen || isMobile) && <span className={`ml-2 ${pathname.startsWith('/dashboard/history') && "text-[#FFFFFF]"}`}>変更履歴</span>}
            </Link>
          </li>
          <li
            className={`${
              pathname.startsWith('/dashboard/api_history') ? 'bg-[#ff8892] text-white' : ''
            } rounded-lg p-3 hover:bg-[#ff8892] text-white transition-all duration-100`}
          >
            <Link href="/dashboard/api_history" className="flex items-center">
              <ApiIcon className={`w-[18px] h-[18px] ${pathname.startsWith('/dashboard/api_history') && "text-[#FFFFFF]"}`} />
              {(isSidebarOpen || isMobile) && <span className={`ml-2 ${pathname.startsWith('/dashboard/api_history') && "text-[#FFFFFF]"}`}>APIロク゛</span>}
            </Link>
          </li>

          <li
            className={`${
              pathname.startsWith('/dashboard/error_log') ? 'bg-[#ff8892] text-white' : ''
            } rounded-lg p-3 hover:bg-[#ff8892] text-white transition-all duration-100`}
          >
            <Link href="/dashboard/error_log" className="flex items-center">
              <ErrorIcon className={`w-[18px] h-[18px] ${pathname.startsWith('/dashboard/error_log') && "text-[#FFFFFF]"}`} />
              {(isSidebarOpen || isMobile) && <span className={`ml-2 ${pathname.startsWith('/dashboard/error_log') && "text-[#FFFFFF]"}`}>エラーログ</span>}
            </Link>
          </li>
          <li
            className={`${
              pathname.startsWith('/dashboard/file') ? 'bg-[#ff8892] text-white' : ''
            } rounded-lg p-3 hover:bg-[#ff8892] text-white transition-all duration-100`}
          >
            <Link href="/dashboard/file" className="flex items-center">
              <FileIcon className={`w-[18px] h-[18px] ${pathname.startsWith('/dashboard/file') && "text-[#FFFFFF]"}`} />
              {(isSidebarOpen || isMobile) && <span className={`ml-2 ${pathname.startsWith('/dashboard/file') && "text-[#FFFFFF]"}`}>ファイル</span>}
            </Link>
          </li>
          <li className="rounded-lg p-3 hover:bg-[#ff8892] text-white transition-all duration-100" onClick={handleLogout}>
            <Link href=""  className="flex items-center">
              <LogoutIcon className={`w-[18px] "text-[#F3A0FF]" h-[18px] `} />
              {(isSidebarOpen || isMobile) && <span className={`ml-2 ${pathname.startsWith('/dashboard/logout') && "text-[#FFFFFF]"}`}>ログアウト</span>}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
