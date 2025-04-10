'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState} from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import Spinner from '@shared/components/UI/Spinner';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDashboard } from '@/hooks/useDashboard';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


export default function ExcelUploader() { 
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] =useState(false);
  const [importedReservation, setImportedReservation] = useState<{flat_name:string,room_num:number,work_name:string,reservation_time:string,division:string}[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { uploadReservationData } = useDashboard();

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];  // Optional chaining for safety
    if (!file) {
      setMessage('まずファイルを選択してください。');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    setIsLoading(true);
    try {
      const response = await uploadReservationData(formData);
      console.log(formData);
      
      const data = await response.json();
      if (response.ok) {
        setMessage('ファイルのアップロードに成功しました。');
        setIsLoading(false);
        setImportedReservation(data.data);
      } else {
        setMessage('アップロードに失敗しました: ' + data.message);
        setIsLoading(false);  // Fix: Set loading state to false on failure
      }
    } catch (error) {
      setIsLoading(false);  // Ensure loading state is cleared in case of an error
      setMessage('ファイルのアップロード中にエラーが発生しました');
      console.error(error);  // Log the error if needed
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = importedReservation.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="bg-gray-900 p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white mb-8">ファイルーアップロード</h1>
          </div>
          <div className="mb-10">            
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              // onClick={handleUpload}
              startIcon={<CloudUploadIcon />}
            >
              アップロード
              <VisuallyHiddenInput
                type="file"
                accept=".xls,.xlsx"
                onChange={(event) => handleFileChange(event)}
                multiple
              />
            </Button>
            <p className='text-white'>{message}</p>
            {/* <p className='text-white'>{file}</p> */}
          </div>
          <div className="overflow-x-auto ">
            <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  {["番号", "案件名","部屋番号","物件名","予約日時","区分"].map((column) => (
                    <th
                      key={column}
                      className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider cursor-pointer"
                     
                    >
                      <div className="flex items-center">
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                        
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentReservations &&(currentReservations.map((reservation, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} hover:bg-gray-700`}>
                    <td className="px-6 py-3 whitespace-nowrap">{(currentPage-1)*itemsPerPage+index+1}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{reservation.flat_name}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{reservation.room_num}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{reservation.work_name}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{reservation.reservation_time ? new Date(reservation.reservation_time).toISOString().split('T')[0] : 'N/A'}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{reservation.division}</td>
                    
                  </tr>
                )))}
              </tbody>         
            </table> 
            <div className="flex justify-center">
              <Stack spacing={2} className='bg-gray-700 mt-1 rounded-[10px] py-1 px-5'>                    
                <Pagination 
                  color="primary" 
                  count={Math.ceil(importedReservation.length / itemsPerPage)} 
                  page={currentPage} 
                  onChange={handlePageChange} 
                /> 
              </Stack>
            </div>         
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    /</DashboardLayout>
  );
}
