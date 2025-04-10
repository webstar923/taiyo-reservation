/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { FaSearch, FaSort } from "react-icons/fa";
import MessageIcon from '@public/assets/icons/message_icon.svg';
import BellIcon from '@public/assets/icons/notification-01.svg';
import { useDashboard } from '@/hooks/useDashboard';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CheckIcon from '@public/assets/icons/check_circle_icon.svg';
import ErrorIcon from'@public/assets/icons/error_icon (log).svg';
import Modal from '@shared/components/UI/Modal';

interface Log {
  id: number;  
  user_id: string;
  timestamp: string;
  request_id: string;
  endpoint: string;
  ip_address: string;
  level: string;
  message: string;
  method: string;
  status_code: string;
}

const Api_Log = () => {
  const { getApiLogData } = useDashboard();
  const [apiLogs, setApiLogs] = useState<Log[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Log | null>(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<Log | null>(null);
  const itemsPerPage = 10;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getApiLogData(currentPage, searchTerm);

        // Check if response.data is valid and an array
        if (Array.isArray(response.data) && response.data.length > 0) {
          setApiLogs(response.data.map((log: any) => ({
            id: log.id,
            user_id: log.user_id || '',
            timestamp: log.timestamp,
            request_id: log.request_id || '',
            endpoint: log.endpoint || '',
            ip_address: log.ip_address || '',
            level: log.level,
            message: log.message,
            method: log.method || '',
            status_code: log.status_code || '',
          })));
        } else {
          // Handle the case where there is no data or the data is empty
          setApiLogs([]);
        }

        // Set the total pages from the response, ensuring pagination is provided
        setTotalPage(response.pagination?.totalPages || 0);
      } catch (error) {
        console.error("Error fetching data", error);
        // Optionally, you can display an error message to the user or log it.
      }
    };

    fetchData();
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (column: keyof Log) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const openModal = (log: Log) => {
    setModalContent(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col bg-gray-900">
        <div className="bg-gray-900 p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white mb-8">APIロク゛</h1>
          </div>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="検索変更履歴..."
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
                  {["番号", "状態", "時間", "メッセージ"].map((column, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort(column as keyof Log)}
                    >
                      <div className="flex items-center">
                        {column}
                        {sortColumn === column && (
                          <FaSort className={`ml-1 ${sortDirection === "asc" ? "text-gray-400" : "text-gray-200"}`} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apiLogs.map((log, index) => (
                  <tr key={log.id} className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} hover:bg-gray-700`} onClick={() => openModal(log)}>
                    <td className="px-6 py-3 w-[5%] whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-6 py-3 w-[5%] whitespace-nowrap">
                      {log.level === "change" ? <CheckIcon /> : log.level === "error" ? <ErrorIcon /> : log.level === "info" ? <MessageIcon /> : <BellIcon />}
                    </td>
                    <td className="px-6 py-3 w-[15%] whitespace-nowrap">{new Date(log.timestamp).toISOString().replace("T", " ").replace(".000Z", "")}</td>
                    <td className="px-6 py-3 w-[75%] whitespace-wrap">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center">
              <Stack spacing={2} className="bg-gray-700 mt-1 rounded-[10px] py-1 px-5">
                <Pagination color="primary" count={totalPage} page={currentPage} onChange={handlePageChange} />
              </Stack>
            </div>
          </div>
        </div>
      </div>

      {modalContent && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="absolute z-20 w-[90vw] left-[5vw] overflow-auto">
            <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
              <thead>
                <tr>
                  {["レベル", "リクエストID", "IPアドレス", "ユーザーID", "ステータスコード", "メソッド", "エンドポイント", "タイムスタンプ"].map((header, index) => (
                    <th key={index} className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider cursor-pointer">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-100 bg-[#d1d8da]">
                  <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.level}</td>
                  <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.request_id}</td>
                  <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.ip_address}</td>
                  <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.user_id}</td>
                  <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.status_code}</td>
                  <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.method}</td>
                  <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{modalContent?.endpoint}</td>
                  <td className="px-6 py-3 whitespace-wrap text-[#201f71]">{new Date(modalContent?.timestamp).toISOString().replace("T", " ").replace(".000Z", "")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Api_Log;
