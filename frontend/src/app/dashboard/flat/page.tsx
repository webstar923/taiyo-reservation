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
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper } from '@mui/material';
import { ChangeEvent } from 'react';
import MenuItem from '@mui/material/MenuItem';

interface Employee {
  id: number;
  name: string;
  address: string
}

interface Row {
  id: number;
  roomNum: number;
  workName: string;
}
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(40%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const currencies = [
  { "id": 1, "name": "貯水槽清掃" },
  { "id": 2, "name": "排水管清掃" },
  { "id": 3, "name": "雨水管清掃" },
  { "id": 4, "name": "給排水設備点検" },
  { "id": 5, "name": "受水槽・高架水槽補修" },
  { "id": 6, "name": "受水槽・高架水槽更新" },
  { "id": 7, "name": "給水ポンプ分解整備" },
  { "id": 8, "name": "給水ポンプ更新" },
  { "id": 9, "name": "排水ポンプ更新" },
  { "id": 10, "name": "給排水管設備劣化診断" },
  { "id": 11, "name": "共用部給水管更新" },
  { "id": 12, "name": "共用部排水管更新" },
  { "id": 13, "name": "専有部給水管更新" },
  { "id": 14, "name": "専有部排水管更新" },
  { "id": 15, "name": "水道メーター交換" },
  { "id": 16, "name": "戸別バルブ更新" },
  { "id": 17, "name": "消防用連結送水管更新" },
  { "id": 18, "name": "給湯管更新" },
  { "id": 19, "name": "防水・塗装工事" },
  { "id": 20, "name": "非常照明器具の更新" },
  { "id": 21, "name": "配電盤の更新" }
];

const DashboardPage = () => {
  const { getFlatData,changeFlat,createFlat, deleteFlat} = useDashboard();
  const [employees, setEmployees] = useState<{ id: number, name: string, address: string}[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add modal state
  const [modalContent, setModalContent] = useState<{ type: string, employee?: Employee }>(); // Optional: Store modal content
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [open, setOpen] = useState(false);
  const [uploadfile, setUploadfile] = useState<File | null>(null);
  
  const [rows, setRows] = useState<Row[]>([{ id: 1, roomNum: 0, workName: '' }]);


  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFlatData();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []); 

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadfile(file);
  };
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredEmployees = employees.filter((employee) =>
    Object.values(employee).some(
      (value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortColumn) {
      const column = sortColumn as keyof typeof a; // Ensure TypeScript knows it's a valid key
      if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const openModal = (employee?: Employee, type: string = '') => {
    setModalContent({ type, employee });
  
    if (employee) { // Ensures employee is neither undefined nor null
      setName(employee.name);
      setAddress(employee.address);
    } else {
      setName('');
      setAddress('');
    }
  
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
    setModalContent(undefined); // Reset modal content
  };

  
  
  const handleSave = async () => {
    if (!modalContent?.employee) {
      notify('error', 'エラー!', 'データがありません!');
      return;
    }
  
    const updatedFlatData = { id: modalContent.employee.id, name: name, address: address };

    try {
      await changeFlat(updatedFlatData);
      setEmployees(prevEmployees =>
        prevEmployees.map(employee =>
          employee.id === updatedFlatData.id ? updatedFlatData : employee
        )
      );
      notify('success', '成功!', 'データが正常に変更されました!');
    } catch (error) {
      console.log(error);
      notify('error', 'エラー!', '資料保管中にエラーが発生しました!');
    }
  
    handleCloseModal();
  };
  
  const handleCreate = async () => {
    const formData = new FormData();
    if (uploadfile) {
      formData.append('file', uploadfile);
      const response = await fetch('http://133.167.124.254:5000/upload', {
        method: 'POST',
        body: formData,
      });
      console.log(response);
    }
    
    const saveFlatData = { name: name, address: address, works:rows}
    try {
      const createdFlat = await createFlat(saveFlatData);
      setEmployees(prevEmployees => [
        ...prevEmployees,  // Spread the existing employees
        createdFlat        // Add the newly created flat to the array
      ]);
      notify('success', '成功!', 'データが成果的に保管されました!');
    } catch (error) {     
      console.log(error) 
      notify('error', 'エラー!', '資料保管中にエラーが発生しました!');
    }
    handleCloseModal();
  }
  const handleDelete = async () => {
    if (!modalContent?.employee) {
      notify('error', 'エラー!', 'データがありません!');
      return;
    }
  
    const id = modalContent.employee.id; // Now safe to access
  
    try {
      // Call deleteFlat to remove the data
      const deletedFlat = await deleteFlat(id);
  
      setEmployees(prevEmployees =>
        prevEmployees.filter(employee => employee.id !== deletedFlat.flat.id)
      );
  
      notify('success', '成功!', 'データが正常に削除されました!');
    } catch (error) {
      console.log(error);
      notify('error', 'エラー!', '資料削除中にエラーが発生しました!');
    }
  
    handleCloseModal();
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: keyof Row) => {
    const newRows = [...rows];
    if (field === 'roomNum') {
      newRows[index].roomNum = parseInt(e.target.value) || 0;
    } else if (field === 'workName') {
      newRows[index].workName = e.target.value;
    }
    setRows(newRows);
  };

  const handleAddRow = () => {
    const newRow = { id: rows.length + 1, roomNum: 0, workName: '' };
    setRows([...rows, newRow]);
  };


  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="bg-gray-900 p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white mb-8">物件一覧</h1>
            <CustomButton
              type="button"
              className="font-semibold !text-[40px]"
              label="+追加"
              onClick={() => openModal(undefined, 'create')} // Pass undefined instead of an empty string
            />
          </div>

          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="検索物件..."
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
                  {["番号", "名前", "住所"].map((column) => (
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
                {currentEmployees.map((employee, index) => (
                  <tr key={employee.id} className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} hover:bg-gray-700`}>
                    <td className="px-6 py-3 whitespace-nowrap">{(currentPage-1)*itemsPerPage+index+1}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{employee.name}</td>
                    <td className="px-6 py-3 whitespace-nowrap">{employee.address}</td>
                    <td className="px-6 py-3 whitespace-nowrap flex gap-3">
                      <button onClick={() => openModal(employee, 'edit')} className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">編集</button>
                      <button onClick={() => openModal(employee, 'delete')} className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded">削除</button>
                    </td>
                  </tr>
                ))}
              </tbody>         
            </table> 
            <div className="flex justify-center">
              <Stack spacing={2} className='bg-gray-700 mt-1 rounded-[10px] py-1 px-5'>                    
                <Pagination 
                  color="primary" 
                  count={Math.ceil(sortedEmployees.length / itemsPerPage)} 
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
                        placeholder="名前"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        placeholder="住所"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
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
                  <h2 className="text-xl font-bold mb-4">新規物件</h2>
                  <div className="space-y-4">
                      <input
                          type="text"
                          placeholder="名前"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                      />
                      <input
                          type="text"
                          placeholder="住所"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                      />
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
                          accept="*.*"
                          onChange={(event) => handleFileChange(event)}
                          multiple
                        />
                      </Button>
                      <div style={{display: 'flex', flexDirection: 'column', maxWidth: '600px',}}>
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow >
                                <TableCell className='text-[20px]'>部屋番号</TableCell>
                                <TableCell className='text-[20px]'>案件名</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.map((row, index) => (
                                <TableRow key={row.id}>                                  
                                  <TableCell>
                                    <TextField
                                      type='number'
                                      minRows = {0}
                                      value={row.roomNum}
                                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, index, 'roomNum')}
                                      className='w-20'                          
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      select
                                      value={row.workName}  
                                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, index, 'workName')}
                                      className="w-full p-2 border border-gray-300 rounded"
                                    >
                                      {currencies.map((option, index) => (
                                        <MenuItem key={`${option.name}-${index}`} value={option.name}>
                                          {option.name}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  </TableCell>                                  
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Button onClick={handleAddRow}　className='font-bold text-[20px]' variant="contained" style={{ marginTop: '20px' }}>
                         案件追加
                        </Button>
                      </div>
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
                    onClick={handleDelete}  // This will trigger the deletion action
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
