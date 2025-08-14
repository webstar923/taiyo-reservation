/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/app/layout/DashboardLayout";
import { FaArrowRight, FaSearch, FaSort } from "react-icons/fa";
import CustomButton from "@shared/components/UI/CustomButton";
import { useDashboard } from "@/hooks/useDashboard";
import Modal from "@shared/components/UI/Modal";
import { notify } from "@/utils/notification";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ChangeEvent } from "react";
import { Timezone } from "next-intl";
import NotoSansJP_BASE64 from "@public/assets/fonts/NotoSansJP-base64";

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
interface Employee {
  id: number;
  name: string;
  address: string;
}

interface Row {
  id: number;
  roomNum: number;
  workName: string;
}
interface Work {
  id?: number;
  work_name: string;
  flat_name: string;
  room_num: number;
  start_time: Timezone;
  end_time: Timezone;
  checkbox_list: string;
  hose_length: number;
  hose_placement: string;
  key_management: string;
  notes: string;
  required_tools: string;
  team_size: number;
  work_duration: number;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(40%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
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
  { "id": 21, "name": "配電盤の更新" },
  { "id": 22, "name": "排水菅清掃" },
  { "id": 23, "name": "消防設備点検" },
];
const weekdayOptions = [
  { key: "mon", label: "月" },
  { key: "tue", label: "火" },
  { key: "wed", label: "水" },
  { key: "thu", label: "木" },
  { key: "fri", label: "金" },
  { key: "sat", label: "土" },
  { key: "sun", label: "日" },
];
const buildingStructureOptions = [
  { value: "横移動可", label: "横移動可" },
  { value: "横移動不可", label: "横移動不可" },
];
const hourList = Array.from(
  { length: 24 },
  (_, h) => h.toString().padStart(2, "0"),
);
const FlatPage = () => {
  const {
    getFlatData,
    changeFlat,
    createFlat,
    deleteFlat,
    getWorkDataByFlat,
    changeFlatDetailInfo,
    getFlatDetailInfoByflatId,
    uploadFlatInfoFile,
  } = useDashboard();
  const [employees, setEmployees] = useState<
    { id: number; name: string; address: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add modal state
  const [modalContent, setModalContent] = useState<
    { type: string; employee?: Employee }
  >(); // Optional: Store modal content
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [uploadfile, setUploadfile] = useState<File | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [parkingLocation, setParkingLocation] = useState("");
  const [machineLocation, setMachineLocation] = useState("");
  const [waterTapLocation, setWaterTapLocation] = useState("");
  const [buildingStructure, setBuildingStructure] = useState("");
  const [autoLockNumber, setAutoLockNumber] = useState("");
  const [keyBoxLocation, setKeyBoxLocation] = useState("");
  const [endTime, setEndTime] = useState<string>("00");
  const [telNumber, setTelNumber] = useState("");
  const [faxNumber, setFaxNumber] = useState("");
  const [message, setMessage] = useState("");
  const [storedFileName, setStoredFileName] = useState("");

  type ManagerDays = {
    [key: string]: boolean;
  };

  const [managerDays, setManagerDays] = useState<ManagerDays>(() =>
    weekdayOptions.reduce((acc, { key }) => {
      acc[key] = false;
      return acc;
    }, {} as ManagerDays)
  );
  const [keyBoxExists, setKeyBoxExists] = useState(false);
  const [startTime, setStartTime] = useState<string>("00");

  const [rows, setRows] = useState<Row[]>([{
    id: 1,
    roomNum: 0,
    workName: "",
  }]);

  // Filter end time options based on start time
  const filteredEndTimeOptions = useMemo(() => {
    if (!startTime) return hourList;
    const startHour = parseInt(startTime);
    return hourList.filter((hour) => parseInt(hour) >= startHour);
  }, [startTime]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFlatData();
        console.log(data);

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
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
      (value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
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
  const currentEmployees = sortedEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const openModal = (employee?: Employee, type: string = "") => {
    setModalContent({ type, employee });

    if (employee) { // Ensures employee is neither undefined nor null
      setName(employee.name);
      setAddress(employee.address);
    } else {
      setName("");
      setAddress("");
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal
    setModalContent(undefined); // Reset modal content
  };

  const viewWorkList = async (id: number) => {
    const data = await getWorkDataByFlat(id);
    setWorks(data);
    setModalContent((prev) => ({ ...prev, type: "viewWorkList" }));
  };

  const viewDetail = async (flatId: number) => {
    setModalContent((prev) => ({ ...prev, type: "viewDetail" }));
    const data = await getFlatDetailInfoByflatId(flatId);
    if (!data.flatDetailInfo) {
      setParkingLocation("");
      setMachineLocation("");
      setWaterTapLocation("");
      setBuildingStructure("");
      setAutoLockNumber("");
      setKeyBoxLocation("");
      setKeyBoxExists(false);
      setStartTime("00");
      setEndTime("00");
      setTelNumber("");
      setFaxNumber("");
      setManagerDays({});
      setStoredFileName("");
    } else {
      const info = data.flatDetailInfo;
      setParkingLocation(info.parking_location || "");
      setMachineLocation(info.machine_location || "");
      setWaterTapLocation(info.water_tap_location || "");
      setBuildingStructure(info.building_structure || "");
      setAutoLockNumber(info.auto_lock_number || "");
      setKeyBoxLocation(info.key_box_location || "");
      setKeyBoxExists(!!info.key_box_exists);
      setStartTime(info.start_time || "00");
      setEndTime(info.end_time || "00");
      setTelNumber(info.tel_number || "");
      setFaxNumber(info.fax_number || "");
      setStoredFileName(info.file_data || "");
      try {
        const parsedDays = typeof info.manager_work_days === "string"
          ? JSON.parse(info.manager_work_days)
          : info.manager_work_days;
        setManagerDays(parsedDays || {});
      } catch (e) {
        setManagerDays({});
      }
    }
  };

  const handleSave = async () => {
    if (!modalContent?.employee) {
      notify("error", "エラー!", "データがありません!");
      return;
    }

    const updatedFlatData = {
      id: modalContent.employee.id,
      name: name,
      address: address,
    };

    try {
      await changeFlat(updatedFlatData);
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === updatedFlatData.id ? updatedFlatData : employee
        )
      );
      notify("success", "成功!", "データが正常に変更されました!");
    } catch (error) {
      console.log(error);
      notify("error", "エラー!", "資料保管中にエラーが発生しました!");
    }

    handleCloseModal();
  };
  const handleDetailInfoSave = async () => {
    if (!modalContent?.employee) {
      notify("error", "エラー!", "対象の物件が見つかりません。");
      return;
    }

    const detailData = {
      flat_id: modalContent.employee.id,
      parking_location: parkingLocation,
      machine_location: machineLocation,
      water_tap_location: waterTapLocation,
      building_structure: buildingStructure,
      auto_lock_number: autoLockNumber,
      key_box_exists: keyBoxExists,
      key_box_location: keyBoxLocation,
      manager_work_days: JSON.stringify(managerDays),
      start_time: startTime,
      end_time: endTime,
      tel_number: telNumber,
      fax_number: faxNumber,
      file_data: storedFileName,
    };
    try {
      await changeFlatDetailInfo(detailData);
      notify("success", "成功!", "詳細情報を保存しました。");
      handleCloseModal();
    } catch (error) {
      console.error(error);
      notify("error", "エラー!", "詳細情報の保存に失敗しました。");
    }
  };

  const handleCreate = async () => {
    const formData = new FormData();
    if (uploadfile) {
      formData.append("file", uploadfile);
      const response = await fetch("http://133.167.124.254:5000/upload", {
        method: "POST",
        body: formData,
      });
      console.log(response);
    }

    const saveFlatData = { name: name, address: address, works: rows };
    try {
      const createdFlat = await createFlat(saveFlatData);
      setEmployees((prevEmployees) => [
        ...prevEmployees, // Spread the existing employees
        createdFlat, // Add the newly created flat to the array
      ]);
      notify("success", "成功!", "データが成果的に保管されました!");
    } catch (error) {
      console.log(error);
      notify("error", "エラー!", "資料保管中にエラーが発生しました!");
    }
    handleCloseModal();
  };
  const handleDelete = async () => {
    if (!modalContent?.employee) {
      notify("error", "エラー!", "データがありません!");
      return;
    }

    const id = modalContent.employee.id; // Now safe to access

    try {
      // Call deleteFlat to remove the data
      const deletedFlat = await deleteFlat(id);

      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== deletedFlat.flat.id)
      );

      notify("success", "成功!", "データが正常に削除されました!");
    } catch (error) {
      console.log(error);
      notify("error", "エラー!", "資料削除中にエラーが発生しました!");
    }

    handleCloseModal();
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Row,
  ) => {
    const newRows = [...rows];
    if (field === "roomNum") {
      newRows[index].roomNum = parseInt(e.target.value) || 0;
    } else if (field === "workName") {
      newRows[index].workName = e.target.value;
    }
    setRows(newRows);
  };

  const handleAddRow = () => {
    const newRow = { id: rows.length + 1, roomNum: 0, workName: "" };
    setRows([...rows, newRow]);
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    doc.addFileToVFS("NotoSansJP-Regular.ttf", NotoSansJP_BASE64);
    doc.addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
    doc.setFont("NotoSansJP");

    doc.text("物件データ一覧", 20, 20);

    const bodyData = [
      ["番号", "名前", "住所"], // <- HEADER ROW here!
      ...employees.map((employee, index) => [
        (index + 1).toString(),
        employee.name,
        employee.address,
      ]),
    ];

    autoTable(doc, {
      body: bodyData,
      startY: 30,
      styles: { font: "NotoSansJP", fontSize: 13 },
      didParseCell: (data) => {
        data.cell.styles.font = "NotoSansJP";
        if (data.row.index === 0) { // Header Row Styling
          data.cell.styles.fillColor = [0, 172, 232];
          data.cell.styles.textColor = [250, 250, 250];
          data.cell.styles.fontSize = 13;
          data.cell.styles.halign = "left";
          data.cell.styles.valign = "middle";
        } else {
          data.cell.styles.halign = "left";
          data.cell.styles.textColor = [10, 10, 10];
        }
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save("flat_data.pdf");
  };
  const handleUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]; // Optional chaining for safety
    if (!file) {
      setMessage("まずファイルを選択してください。");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await uploadFlatInfoFile(formData);
      const data = await response.json();
      setStoredFileName(data.storedFileName);
      if (response.ok) {
        setMessage("ファイルのアップロードに成功しました。");
      } else {
        setMessage("アップロードに失敗しました: " + data.message);
      }
    } catch (error) {
      setMessage("ファイルのアップロード中にエラーが発生しました");
      console.error(error); // Log the error if needed
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="bg-gray-900 p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white mb-8">物件一覧</h1>
            <div className="flex gap-3">
              <CustomButton
                type="button"
                className="font-semibold !text-[40px]"
                label="+追加"
                onClick={() => openModal(undefined, "create")} // Pass undefined instead of an empty string
              />
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                // onClick={handleUpload}
                startIcon={<CloudDownloadIcon />}
                sx={{
                  borderRadius: "10px",
                }}
              >
                PDFダウンロード
                <VisuallyHiddenInput
                  type="button"
                  onClick={handleDownloadPDF}
                />
              </Button>
            </div>
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
                          <FaSort
                            className={`ml-1 ${
                              sortDirection === "asc"
                                ? "text-gray-400"
                                : "text-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-[15px] font-medium uppercase tracking-wider">
                    動作
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                    } hover:bg-gray-700`}
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {employee.name}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {employee.address}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap flex gap-3">
                      <button
                        onClick={() => openModal(employee, "edit")}
                        className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => openModal(employee, "delete")}
                        className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center">
              <Stack
                spacing={2}
                className="bg-gray-700 mt-1 rounded-[10px] py-1 px-5"
              >
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
          {modalContent?.type === "edit" && (
            <div className="flex inset-0 items-center justify-center bg-black bg-opacity-50">
              <div className="bg-[#FFFFFF] p-6 rounded-[10px] shadow-lg w-full">
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
                    onClick={() =>
                      viewWorkList(modalContent?.employee?.id || 0)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-800"
                  >
                    年間案件ー覧
                  </button>
                  <button
                    onClick={() => viewDetail(modalContent?.employee?.id || 0)}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-900"
                  >
                    詳細を見る
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-500"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}
          {modalContent?.type === "create" && (
            <div className="flex inset-0 items-center justify-center bg-black bg-opacity-50">
              <div className="bg-[#FFFFFF] p-6 rounded-[10px] shadow-lg w-full">
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      maxWidth: "600px",
                    }}
                  >
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell className="text-[20px]">
                              部屋番号
                            </TableCell>
                            <TableCell className="text-[20px]">
                              案件名
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row, index) => (
                            <TableRow key={row.id}>
                              <TableCell>
                                <TextField
                                  type="number"
                                  minRows={0}
                                  value={row.roomNum}
                                  onChange={(
                                    e: ChangeEvent<HTMLInputElement>,
                                  ) => handleInputChange(e, index, "roomNum")}
                                  className="w-20"
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  select
                                  value={row.workName}
                                  onChange={(
                                    e: ChangeEvent<HTMLInputElement>,
                                  ) => handleInputChange(e, index, "workName")}
                                  className="w-full p-2 border border-gray-300 rounded"
                                >
                                  {currencies.map((option, index) => (
                                    <MenuItem
                                      key={`${option.name}-${index}`}
                                      value={option.name}
                                    >
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
                    <Button
                      onClick={handleAddRow}
                      className="font-bold text-[20px]"
                      variant="contained"
                      style={{ marginTop: "20px" }}
                    >
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
          {modalContent?.type === "delete" && (
            <div className="flex inset-0 items-center justify-center bg-black bg-opacity-50">
              <div className="bg-[#FFFFFF] p-6 rounded-[10px] shadow-lg w-full">
                <h2 className="text-xl font-bold mb-4">資料を削除しますか?</h2>
                <p className="mb-6">
                  この操作は取り消せません。削除を確認してください。
                </p>

                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={handleDelete} // This will trigger the deletion action
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    はい
                  </button>
                  <button
                    onClick={handleCloseModal} // This will close the modal without performing any action
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  >
                    いいえ
                  </button>
                </div>
              </div>
            </div>
          )}
          {modalContent?.type === "viewWorkList" && (
            <div className="flex items-center justify-center inset-0 bg-black bg-opacity-30 min-h-screen fixed top-0 left-0 right-0 z-50">
              <div className="w-full max-w-5xl bg-white rounded-[10px] shadow-lg overflow-x-auto p-2">
                <table className="w-full bg-white text-gray-900 rounded-lg border border-gray-200">
                  <thead>
                    <tr className="bg-gray-300">
                      {["番号", "案件名", "部屋番号", "開始期間", "終了期間"]
                        .map((column) => (
                          <th
                            key={column}
                            className="px-6 py-3 text-left text-[15px] font-semibold tracking-wider cursor-pointer"
                            onClick={() => handleSort(column)}
                          >
                            <div className="flex items-center">
                              {column}
                              {sortColumn === column && (
                                <FaSort
                                  className={`ml-1 ${
                                    sortDirection === "asc"
                                      ? "text-gray-500"
                                      : "text-gray-700"
                                  }`}
                                />
                              )}
                            </div>
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {works.map((work, index) => (
                      <tr
                        key={work.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-gray-100 transition-colors`}
                      >
                        <td className="px-6 py-3 whitespace-nowrap">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {work.work_name}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {work.room_num}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {work.start_time
                            ? new Date(work.start_time).toISOString().split(
                              "T",
                            )[0]
                            : "N/A"}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {work.end_time
                            ? new Date(work.end_time).toISOString().split(
                              "T",
                            )[0]
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={handleCloseModal}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-500"
                  >
                    戻る
                  </button>
                </div>
              </div>
            </div>
          )}
          {modalContent?.type === "viewDetail" && (
            <div className="flex items-center justify-center inset-0 bg-black bg-opacity-30 min-h-screen fixed top-0 left-0 right-0 z-50">
              <div className="w-full max-w-3xl bg-white rounded-[10px] shadow-lg overflow-x-auto p-4">
                <h2 className="text-xl font-bold mb-5 mt-5">
                  {modalContent.employee?.name}の物件詳細
                </h2>
                <div className="space-y-4">
                  <TextField
                    label="作業車両の停車位置"
                    variant="outlined"
                    className="w-full border border-gray-300 rounded"
                    value={parkingLocation}
                    onChange={(e) => setParkingLocation(e.target.value)}
                  />
                  <TextField
                    label="高圧洗浄機の設置位置"
                    variant="outlined"
                    className="w-full border border-gray-300 rounded"
                    value={machineLocation}
                    onChange={(e) => setMachineLocation(e.target.value)}
                  />
                  <TextField
                    label="散水栓の場所"
                    variant="outlined"
                    className="w-full border border-gray-300 rounded"
                    value={waterTapLocation}
                    onChange={(e) => setWaterTapLocation(e.target.value)}
                  />
                  <TextField
                    select
                    label="建物構造"
                    className="w-full border border-gray-300 rounded"
                    value={buildingStructure}
                    SelectProps={{
                      MenuProps: {
                        disableScrollLock: true,
                      },
                    }}
                    onChange={(e) => setBuildingStructure(e.target.value)}
                  >
                    {buildingStructureOptions.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>{label}</MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="オートロック番号"
                    type="number"
                    variant="outlined"
                    className="w-full border border-gray-300 rounded"
                    value={autoLockNumber}
                    onChange={(e) => setAutoLockNumber(e.target.value)}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={keyBoxExists}
                        onChange={(e) => setKeyBoxExists(e.target.checked)}
                      />
                    }
                    label="キーBOXの有無"
                  />
                  {keyBoxExists && (
                    <TextField
                      label="キーBOXの設置場所"
                      variant="outlined"
                      className="w-full border border-gray-300 rounded"
                      value={keyBoxLocation}
                      onChange={(e) => setKeyBoxLocation(e.target.value)}
                    />
                  )}
                  <FormGroup row>
                    {weekdayOptions.map(({ key, label }) => (
                      <FormControlLabel
                        key={key}
                        control={
                          <Checkbox
                            checked={!!managerDays[key]} // Ensures a boolean value
                            onChange={(e) =>
                              setManagerDays((prev) => ({
                                ...prev,
                                [key]: e.target.checked,
                              }))}
                          />
                        }
                        label={label}
                      />
                    ))}
                  </FormGroup>
                  <div className="flex gap-2">
                    <TextField
                      select
                      label="開始期間"
                      className="w-1/2 border border-gray-300 rounded"
                      value={startTime}
                      SelectProps={{
                        MenuProps: {
                          disableScrollLock: true,
                        },
                      }}
                      onChange={(e) => setStartTime(e.target.value)}
                    >
                      {hourList.map((h) => (
                        <MenuItem key={h} value={h}>{`${h}:00`}</MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      label="終了期間"
                      className="w-1/2 border border-gray-300 rounded"
                      value={endTime}
                      SelectProps={{
                        MenuProps: {
                          disableScrollLock: true,
                        },
                      }}
                      onChange={(e) => setEndTime(e.target.value)}
                    >
                      {filteredEndTimeOptions.map((h: string) => (
                        <MenuItem key={h} value={h}>{`${h}:00`}</MenuItem>
                      ))}
                    </TextField>
                  </div>

                  <div className="flex gap-2">
                    <TextField
                      label="現地電話番号"
                      type="number"
                      variant="outlined"
                      className="w-full border border-gray-300 rounded"
                      value={telNumber}
                      onChange={(e) => setTelNumber(e.target.value)}
                    />
                    <TextField
                      label="FAX番号"
                      multiline
                      variant="outlined"
                      className="w-full border border-gray-300 rounded"
                      value={faxNumber}
                      onChange={(e) => setFaxNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-4 space-x-2">
                  <div className="flex gap-4">
                    {!storedFileName
                      ? (
                        <div>
                          <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            // onClick={handleUpload}
                            startIcon={<CloudUploadIcon />}
                            sx={{
                              borderRadius: "10px",
                            }}
                          >
                            アップロード
                            <VisuallyHiddenInput
                              type="file"
                              accept="*.*"
                              onChange={(event) => handleUploadFile(event)}
                              multiple
                            />
                          </Button>
                          <p className="flex mt-4 text-black">{message}</p>
                        </div>
                      )
                      : (
                        <a
                          href={`https://docs.google.com/viewer?url=https://taiyo.ai-reserve.jp/uploads/${storedFileName}&embedded=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "underline" }}
                        >
                          物件関連ファイルの資料を開く
                        </a>
                      )}

                    {/* <p className='text-white'>{file}</p> */}
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleDetailInfoSave}
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
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default FlatPage;
