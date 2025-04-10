'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { FaSearch, FaSort } from "react-icons/fa";
import BellIcon from '@public/assets/icons/notification-01.svg';
import { useDashboard } from '@/hooks/useDashboard';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useNotificationData } from '@/state/notificationNum';

const Notification = () => {
  const { getNotification, markAsRead } = useDashboard();
  const [notificationData, setNotificationData] = useState<
    { id: number; timestamp: string; message: string; isRead: boolean }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const { NotificationNum, setField } = useNotificationData();
  const itemsPerPage = 10;

  interface Notification {
    id: number;
    message: string;
    isRead?: boolean;
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotification();
        
        // Assuming `data.notificationData` is an array of Notification objects
        setNotificationData(
          data.notificationData.map((n: Notification) => ({
            ...n,
            isRead: n.isRead ?? false, // Ensure isRead is a boolean
          }))
        );
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleCheck = async (id: number) => {
    try {
      await markAsRead(id);
      setField('Notification_Num', NotificationNum.Notification_Num - 1);
      setNotificationData((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error("Failed to update read status", error);
    }
  };

  const filterNotifications = notificationData.filter((notification) =>
    Object.values(notification).some(
      (value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedNotifications = [...filterNotifications].sort((a, b) => {
    if (sortColumn) {
      const column = sortColumn as keyof typeof a;
      if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = sortedNotifications.slice(indexOfFirstItem, indexOfLastItem);
  
  return (
    <DashboardLayout>
      <div className="flex flex-col bg-gray-900">     
        <div className="bg-gray-900 p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white mb-8">重要通知内容</h1>
          </div>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="検索通知内容..."
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  {["番号", "状態", "時間", "メッセージ", "チェック"].map((column) => (
                    <th
                      key={column}
                      className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort(column)}
                    >
                      <div className="flex items-center">
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                        {sortColumn === column && (
                          <FaSort className={`ml-1 ${sortDirection === "asc" ? "text-gray-400" : "text-gray-200"}`} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentNotifications.map((notification, index) => (
                  <tr key={notification.id} className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} hover:bg-gray-700`}>
                    <td className="px-6 py-3 whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-6 py-3 whitespace-nowrap"><BellIcon /></td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {new Date(notification.timestamp).toISOString().replace("T", " ").replace(".000Z", "")}
                    </td>
                    <td className="px-6 py-3 w-[65%]">{notification.message}</td>
                    <td className="px-6 py-3 text-center">
                      <input 
                        type="checkbox" 
                        checked={!!notification.isRead}  // Ensure boolean value
                        onChange={() => handleCheck(notification.id)} 
                        className="w-5 h-5 cursor-pointer"
                        disabled={!!notification.isRead} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>         
            </table> 
            <div className="flex justify-center">
              <Stack spacing={2} className='bg-gray-700 mt-1 rounded-[10px] py-1 px-5'>                    
                <Pagination 
                  color="primary" 
                  count={Math.ceil(sortedNotifications.length / itemsPerPage)} 
                  page={currentPage} 
                  onChange={handlePageChange} 
                /> 
              </Stack>
            </div>         
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notification;
