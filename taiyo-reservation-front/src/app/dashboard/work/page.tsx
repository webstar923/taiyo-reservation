/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/app/layout/DashboardLayout';
import { FaSearch, FaSort } from "react-icons/fa";
import CustomButton from '@shared/components/UI/CustomButton';
import { useDashboard } from '@/hooks/useDashboard';
import Modal from '@shared/components/UI/Modal';
import { notify } from '@/utils/notification';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Timezone } from 'next-intl';
interface Work {
  id?: number;
  work_name: string;
  flat_name:string;
  room_num:number;
  start_time:Timezone;
  end_time:Timezone
}

const DashboardPage = () => {
  const { getWorkData,changeWork,createWork, deleteWork} = useDashboard();
  const [works, setWorks] = useState<Work[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add modal state
  const [modalContent, setModalContent] = useState<{ type: string, works?: Work } | null>(null); // Optional: Store modal content
  const [workName, setWorkName] = useState('');
  const [roomNum, setRoomNum] = useState(0);
  const [flatName, setFlatName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

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
        const data = await getWorkData();
        setWorks(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

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

  const filteredWorks = works.filter((works) =>
    Object.values(works).some(
      (value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedWorks = [...filteredWorks].sort((a, b) => {
    if (sortColumn) {
      const column = sortColumn as keyof Work;
  
      // Check if both a[column] and b[column] are defined
      if (a[column] !== undefined && b[column] !== undefined) {
        if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
        if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWorks = sortedWorks.slice(indexOfFirstItem, indexOfLastItem);

  const openModal = (works: Work | null, type: string) => {
    setModalContent({ type, works:works?? undefined });
    console.log("this is works:",works);
    
    if(works !== null){
      setWorkName(works.work_name);
      setFlatName(works.flat_name);
      setRoomNum(works.room_num);
      setStartTime(new Date(works.start_time).toISOString().split('T')[0]);
      setEndTime(new Date(works.end_time).toISOString().split('T')[0]);
      
      
    }else{
      setWorkName('');
      setFlatName('');
      setRoomNum(0);
      setStartTime('');
      setEndTime('');
    }   
    setIsModalOpen(true);    
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
    setModalContent(null); 
  };

  
  
  const handleSave = async () => {
    const updatedWorkData = { 
        id: modalContent?.works?.id,
        work_name: workName, 
        flat_name: flatName, 
        room_num: roomNum, 
        start_time: startTime, 
        end_time: endTime  
    };
    
    console.log('this is startTime type:', typeof(updatedWorkData.start_time));
    
    // Validate updatedWorkData.id
    if (!updatedWorkData.id) {
      console.log("ID is invalid", updatedWorkData.id);
      return; // Prevent further actions
    }

    try {
        // Make the API call to update the work data
        await changeWork(updatedWorkData);

        // Update the state with the modified work data
        setWorks(prevworks => {
            return prevworks.map(works => 
                works.id === updatedWorkData.id ? updatedWorkData : works
            );
        });

        // Notify the user of the success
        notify('success', '成功!', 'データが成果的に変更されました!');
    } catch (error) {
        // Handle errors in case the update fails
        notify('error', 'エラー!', '資料保管中にエラーが発生しました!');
        console.log(error);
    }

    // Close the modal
    handleCloseModal();
};

  const handleCreate = async () => {
    const saveWorkData = { 
      work_name: workName, 
      flat_name: flatName, 
      room_num: roomNum, 
      start_time: startTime, 
      end_time: endTime 
    };
    console.log("this interface",endTime)
    
    try {
      const createdWork = await createWork(saveWorkData);
      // Check if createdWork is defined and valid before adding it
      if (createdWork) {
        setWorks(prevWorks => [
          ...prevWorks,
          createdWork // Ensure createdWork is of the expected type
        ]);
        notify('success', '成功!', 'データが成果的に保管されました!');
      } else {
        notify('error', 'エラー!', '作成されたデータは無効です!');
      }
    } catch (error) {
      notify('error', 'エラー!', '資料保管中にエラーが発生しました!');
      console.log(error);
    }
    handleCloseModal();
  };
  
  
  const handleDelte = async () =>{
    const id = modalContent?.works?.id; 
    
    try {
      const deletedWork = await deleteWork(Number(id));
      console.log("ddddd",deletedWork)
      setWorks(prevworkss => {
        return prevworkss.filter(works => works.id !== id);
      });
      notify('success', '成功!', 'データが成果的に削除されました!');
    } catch (error) {      
      notify('error', 'エラー!', '資料削除中にエラーが発生しました!');
      console.log(error);
    }
    handleCloseModal();
  }


  return (
    <DashboardLayout>
      <div className="flex flex-col bg-gray-900">
        <div className="bg-gray-900 p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white mb-8">案件一覧</h1>
            <CustomButton
              type="button"
              className="font-semibold !text-[40px]"
              label="+追加"
              onClick={() => openModal(null, 'create')} // Open modal for creating a new entry
            />
          </div>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="検索案件..."
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>

          <div className="overflow-x-auto ">
            <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  {["番号", "案件名", "物件名","部屋番号","開始時間","終了時間"].map((column) => (
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
                  <th className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider">
                  動作</th>
                </tr>
              </thead>
              <tbody>
                {currentWorks.map((works, index) => (
                  <tr key={works.id} className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} hover:bg-gray-700`}>
                    <td className="px-6 py-3 whitespace-nowrap">{(currentPage-1)*itemsPerPage+index+1}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{works.work_name}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{works.flat_name}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{works.room_num}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{works.start_time ? new Date(works.start_time).toISOString().split('T')[0] : 'N/A'}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{works.end_time ? new Date(works.end_time).toISOString().split('T')[0] : 'N/A'}</td>
                    <td className="px-6 py-3 whitespace-nowrap flex gap-3">
                      <button onClick={() => openModal(works, 'edit')} className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">編集</button>
                      <button onClick={() => openModal(works, 'delete')} className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded">削除</button>
                    </td>
                  </tr>
                ))}
              </tbody>         
            </table> 
            <div className="flex justify-center">
              <Stack spacing={2} className='bg-gray-700 mt-1 rounded-[10px] py-1 px-5'>                    
                <Pagination 
                  color="primary" 
                  count={Math.ceil(sortedWorks.length / itemsPerPage)} 
                  page={currentPage} 
                  onChange={handlePageChange} 
                /> 
              </Stack>
            </div>         
          </div>
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {modalContent?.type === 'edit' && (
            <div className="flex inset-0 items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-[10px] shadow-lg w-full">
                <h2 className="text-xl font-bold mb-4">情報編集</h2>
                <div className="space-y-4">
                  <input
                      type="text"
                      placeholder="案件名"
                      value={workName}
                      onChange={(e) => setWorkName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                  />
                  <input
                      type="text"
                      placeholder="物件名"
                      value={flatName}
                      onChange={(e) => setFlatName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                  />
                  <input
                      type="number"
                      placeholder="部屋番号"
                      value={roomNum}
                      onChange={(e) => setRoomNum(Number(e.target.value)||0)}
                      className="w-full p-2 border border-gray-300 rounded"
                  />
                  <input
                      type="date"
                      placeholder="開始時間"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      min="1900-01-01"
                      max="2099-12-31"
                      className="w-full p-2 border border-gray-300 rounded"
                  />
                  <input
                      type="date"
                      placeholder="終了時間"
                      min="1900-01-01"
                      max="2099-12-31"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        保存
                    </button>
                    <button
                        onClick={handleCloseModal}
                        className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    >
                        取消
                    </button>
                </div>
            </div>
           </div>
          )}
          {modalContent?.type === 'create' && (
            <div className="flex inset-0 items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-[10px] shadow-lg w-full">
                  <h2 className="text-xl font-bold mb-4">新規案件</h2>
                  <div className="space-y-4">
                      <input
                          type="text"
                          placeholder="案件名"
                          value={workName}
                          onChange={(e) => setWorkName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                      />
                      <input
                          type="text"
                          placeholder="物件名"
                          value={flatName}
                          onChange={(e) => setFlatName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                      />
                      <input
                          type="number"
                          placeholder="部屋番号"
                          value={roomNum}
                          onChange={(e) => setRoomNum(Number(e.target.value)||0)}
                          className="w-full p-2 border border-gray-300 rounded"
                      />
                      <input
                          type="date"
                          placeholder="開始時間"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                      />
                      <input
                          type="date"
                          placeholder="終了時間"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                      />
                  </div>
                  <div className="flex justify-end mt-4 space-x-2">
                      <button
                          onClick={handleCreate}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                          保存
                      </button>
                      <button
                          onClick={handleCloseModal}
                          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                      >
                          取消
                      </button>
                  </div>
              </div>
            </div>
          )}
          {modalContent?.type === 'delete' && (
            <div className="flex inset-0 items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-[10px] shadow-lg w-full">
                <h2 className="text-xl font-bold mb-4">資料を削除しますか?</h2>
                <p className="mb-6">この操作は取り消せません。削除を確認してください。</p>

                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={handleDelte}  // This will trigger the deletion action
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    はい
                  </button>
                  <button
                    onClick={handleCloseModal}  // This will close the modal without performing any action
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  >
                    いいえ
                  </button>
                </div>
              </div>
            </div>
          )}

        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
