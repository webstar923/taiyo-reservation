/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { FaSearch, FaSort } from "react-icons/fa";
import { useDashboard } from '@/hooks/useDashboard';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ErrorIcon from'@public/assets/icons/error_icon (log).svg';





const Message = () => {
  const {getErrorLogData} = useDashboard();
  const [errorLogs, setErrorLogs] = useState<{ id: number, timestamp: string, message:string}[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {    
    const fetchData = async () => {
      try {
        const data = await getErrorLogData();
        setErrorLogs(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement> ) => {
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

  const filterError = errorLogs.filter((errors) =>
    Object.values(errors).some(
      (value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedErrors = [...filterError].sort((a, b) => {
    if (sortColumn) {
      const column = sortColumn as keyof typeof a; // Ensure TypeScript knows it's a valid key
      if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentErrors = sortedErrors.slice(indexOfFirstItem, indexOfLastItem);
  
  return (
    <DashboardLayout>
      <div className="flex flex-col bg-gray-900">     

        <div className="bg-gray-900 p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white mb-8">エラーログ</h1>
          </div>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="検索エラーログ..."
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>

          <div className="overflow-x-aut ">
            <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  {["番号", "状態","時間", "メッセージ"].map((column) => (
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
                {currentErrors.map((errors, index) => (
                  <tr key={errors.id} className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} hover:bg-gray-700`}>
                    <td className="px-6 py-3 whitespace-nowrap">{(currentPage-1)*itemsPerPage+index+1}</td>
                    <td className="px-6 py-3 whitespace-nowrap"><ErrorIcon /></td>
                    <td className="px-6 py-3 whitespace-nowrap">{new Date(errors.timestamp).toISOString().replace("T", " ").replace(".000Z", "") }</td>
                    <td className="px-6 py-3 w-[75%] whitespace-wrap">{errors.message}</td>
                  </tr>
                ))}
              </tbody>         
            </table> 
            <div className="flex justify-center">
              <Stack spacing={2} className='bg-white mt-1 rounded-[10px] py-1 px-5'>                    
                <Pagination 
                  color="primary" 
                  count={Math.ceil(sortedErrors.length / itemsPerPage)} 
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

export default Message;
