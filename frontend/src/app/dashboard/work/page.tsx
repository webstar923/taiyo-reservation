/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/app/layout/DashboardLayout";
import { FaSearch, FaSort } from "react-icons/fa";
import CustomButton from "@shared/components/UI/CustomButton";
import { useDashboard } from "@/hooks/useDashboard";
import Modal from "@shared/components/UI/Modal";
import { notify } from "@/utils/notification";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Timezone } from "next-intl";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

interface CheckboxList {
  hasCeilingPiping: boolean;
  hasPit: boolean;
  hasVehicleMove: boolean;
  hasRoadPermit: boolean;
  hasDisposer: boolean;
  hasSlopSink: boolean;
  hasToiletWash: boolean;
  hasToiletCleaning: boolean;
  hasWaterHeaterDrain: boolean;
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
  team_size: string;
  work_duration: string;
}

interface Flat {
  id?: number;
  name: string;
  address: string;
}
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
// Helper functions for checkbox list conversion
const parseCheckboxList = (str: string): CheckboxList => {
  if (!str) {
    return {
      hasCeilingPiping: false,
      hasPit: false,
      hasVehicleMove: false,
      hasRoadPermit: false,
      hasDisposer: false,
      hasSlopSink: false,
      hasToiletWash: false,
      hasToiletCleaning: false,
      hasWaterHeaterDrain: false,
    };
  }

  try {
    return JSON.parse(str) as CheckboxList;
  } catch (error) {
    console.error("Failed to parse checkbox list:", error);
    return {
      hasCeilingPiping: false,
      hasPit: false,
      hasVehicleMove: false,
      hasRoadPermit: false,
      hasDisposer: false,
      hasSlopSink: false,
      hasToiletWash: false,
      hasToiletCleaning: false,
      hasWaterHeaterDrain: false,
    };
  }
};

const stringifyCheckboxList = (obj: CheckboxList): string => {
  return JSON.stringify(obj);
};

const checkboxOptions = [
  { key: "hasCeilingPiping", label: "天井配管の有無" },
  { key: "hasPit", label: "ピットの有無" },
  { key: "hasVehicleMove", label: "車両移動の有無" },
  { key: "hasRoadPermit", label: "道路許可申請の有無" },
  { key: "hasDisposer", label: "ディスポーザーの有無" },
  { key: "hasSlopSink", label: "スロップシンクの有無" },
  { key: "hasToiletWash", label: "トイレ手洗いの有無" },
  { key: "hasToiletCleaning", label: "トイレ清掃の有無" },
  { key: "hasWaterHeaterDrain", label: "温水器ドレンの有無" },
];

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage:
        `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${
          encodeURIComponent(
            theme.palette.getContrastText(theme.palette.primary.main),
          )
        }" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage:
        `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${
          encodeURIComponent(
            theme.palette.getContrastText(theme.palette.primary.main),
          )
        }" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const DashboardPage = () => {
  const { getWorkData, changeWork, createWork, deleteWork, getFlatData } =
    useDashboard();
  const [works, setWorks] = useState<Work[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add modal state
  const [modalContent, setModalContent] = useState<
    { type: string; works?: Work } | null
  >(null); // Optional: Store modal content
  const [workName, setWorkName] = useState("");
  const [roomNum, setRoomNum] = useState(0);
  const [flatName, setFlatName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [hosePlacement, setHosePlacement] = useState<string>("");
  const [hoseLength, setHoseLength] = useState<number | "">("");
  const [requiredTools, setRequiredTools] = useState<string>("");
  const [teamSize, setTeamSize] = useState("");
  const [workDuration, setWorkDuration] = useState("");
  const [keyManagement, setKeyManagement] = useState<"事前用意" | "弊社管理">(
    "事前用意",
  );
  const [notes, setNotes] = useState<string>("");

  interface CheckboxList {
    hasCeilingPiping: boolean;
    hasPit: boolean;
    hasVehicleMove: boolean;
    hasRoadPermit: boolean;
    hasDisposer: boolean;
    hasSlopSink: boolean;
    hasToiletWash: boolean;
    hasToiletCleaning: boolean;
    hasWaterHeaterDrain: boolean;
  }

  const [checkboxList, setCheckboxList] = useState<CheckboxList>({
    hasCeilingPiping: false,
    hasPit: false,
    hasVehicleMove: false,
    hasRoadPermit: false,
    hasDisposer: false,
    hasSlopSink: false,
    hasToiletWash: false,
    hasToiletCleaning: false,
    hasWaterHeaterDrain: false,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const worksData = await getWorkData();
        const flatsData = await getFlatData();

        if (Array.isArray(worksData)) {
          setWorks(worksData);
        } else {
          console.error("Expected worksData to be array:", worksData);
          setWorks([]); // fallback
        }

        if (Array.isArray(flatsData)) {
          setFlats(flatsData);
        } else {
          console.error("Expected flatsData to be array:", flatsData);
          setFlats([]); // fallback
        }
      } catch (error) {
        console.error("Error fetching data", error);
        setWorks([]); // fallback to prevent crash
        setFlats([]);
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

  const filteredWorks = Array.isArray(works)
    ? works.filter((work) => {
      return [
        work.work_name,
        work.flat_name,
        work.room_num?.toString(),
        work.start_time?.toString(),
        work.end_time?.toString(),
      ].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    : [];
  const sortedWorks = [...filteredWorks].sort((a, b) => {
    if (sortColumn) {
      const column = sortColumn as keyof Work;
      if (a[column] !== undefined && b[column] !== undefined) {
        if (a[column]! < b[column]!) return sortDirection === "asc" ? -1 : 1;
        if (a[column]! > b[column]!) return sortDirection === "asc" ? 1 : -1;
      }
    }
    return 0;
  });
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWorks = sortedWorks.slice(indexOfFirstItem, indexOfLastItem);

  const openModal = (works: Work | null, type: string) => {
    setModalContent({ type, works: works ?? undefined });
    if (works !== null) {
      setWorkName(works.work_name);
      setFlatName(works.flat_name);
      setRoomNum(works.room_num);
      setStartTime(new Date(works.start_time).toISOString().split("T")[0]);
      setEndTime(new Date(works.end_time).toISOString().split("T")[0]);
      setHosePlacement(works.hose_placement);
      setHoseLength(works.hose_length);
      setRequiredTools(works.required_tools);
      setTeamSize(works.team_size?.toString());
      setWorkDuration(works.work_duration?.toString());
      setKeyManagement(works.key_management as "事前用意" | "弊社管理");
      setNotes(works.notes);
      setCheckboxList(parseCheckboxList(works.checkbox_list) as CheckboxList);
    } else {
      setWorkName("");
      setFlatName("");
      setRoomNum(0);
      setStartTime("");
      setEndTime("");
      setHosePlacement("");
      setHoseLength(0);
      setRequiredTools("");
      setTeamSize("");
      setWorkDuration("");
      setKeyManagement("事前用意");
      setNotes("");
      setCheckboxList({
        hasCeilingPiping: false,
        hasPit: false,
        hasVehicleMove: false,
        hasRoadPermit: false,
        hasDisposer: false,
        hasSlopSink: false,
        hasToiletWash: false,
        hasToiletCleaning: false,
        hasWaterHeaterDrain: false,
      });
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
      end_time: endTime,
      hose_placement: hosePlacement,
      hose_length: hoseLength,
      required_tools: requiredTools,
      team_size: teamSize,
      work_duration: workDuration,
      key_management: keyManagement,
      notes: notes,
      checkbox_list: stringifyCheckboxList(checkboxList),
    };

    // Validate updatedWorkData.id
    if (!updatedWorkData.id) {
      console.log("ID is invalid", updatedWorkData.id);
      return; // Prevent further actions
    }

    try {
      // Make the API call to update the work data
      await changeWork(updatedWorkData);

      // Update the state with the modified work data
      setWorks((prevworks) => {
        return prevworks.map((works) =>
          works.id === updatedWorkData.id
            ? {
              ...updatedWorkData,
              hose_length: typeof updatedWorkData.hose_length === "string"
                ? Number(updatedWorkData.hose_length)
                : updatedWorkData.hose_length,
            }
            : works
        );
      });

      // Notify the user of the success
      notify("success", "成功!", "データが成果的に変更されました!");
    } catch (error) {
      // Handle errors in case the update fails
      notify("error", "エラー!", "資料保管中にエラーが発生しました!");
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
      end_time: endTime,
      hose_placement: hosePlacement,
      hose_length: hoseLength,
      required_tools: requiredTools,
      team_size: teamSize,
      work_duration: workDuration,
      key_management: keyManagement,
      notes: notes,
      checkbox_list: stringifyCheckboxList(checkboxList),
    };
    console.log("this interface", endTime);

    try {
      const createdWork = await createWork(saveWorkData);
      // Check if createdWork is defined and valid before adding it
      if (createdWork) {
        setWorks((prevWorks) => [
          ...prevWorks,
          createdWork, // Ensure createdWork is of the expected type
        ]);
        notify("success", "成功!", "データが成果的に保管されました!");
      } else {
        notify("error", "エラー!", "作成されたデータは無効です!");
      }
    } catch (error) {
      notify("error", "エラー!", "資料保管中にエラーが発生しました!");
      console.log(error);
    }
    handleCloseModal();
  };

  const handleDelte = async () => {
    const id = modalContent?.works?.id;

    try {
      const deletedWork = await deleteWork(Number(id));
      console.log("ddddd", deletedWork);
      setWorks((prevworkss) => {
        return prevworkss.filter((works) => works.id !== id);
      });
      notify("success", "成功!", "データが成果的に削除されました!");
    } catch (error) {
      notify("error", "エラー!", "資料削除中にエラーが発生しました!");
      console.log(error);
    }
    handleCloseModal();
  };

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
              onClick={() => openModal(null, "create")} // Open modal for creating a new entry
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
                  {[
                    "番号",
                    "案件名",
                    "物件名",
                    "部屋番号",
                    "開始期間",
                    "終了期間",
                  ].map((column) => (
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
                {currentWorks.map((works, index) => (
                  <tr
                    key={works.id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                    } hover:bg-gray-700`}
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {works.work_name}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {works.flat_name}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {works.room_num}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {works.start_time
                        ? new Date(works.start_time).toISOString().split("T")[0]
                        : "N/A"}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {works.end_time
                        ? new Date(works.end_time).toISOString().split("T")[0]
                        : "N/A"}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap flex gap-3">
                      <button
                        onClick={() => openModal(works, "edit")}
                        className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => openModal(works, "delete")}
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
          {modalContent?.type === "edit" && (
            <div className="flex inset-0 items-center justify-center bg-black bg-opacity-50 ">
              <div className="bg-[#FFFFFF] p-5 rounded-[10px] shadow-lg w-full max-h-[99vh] overflow-auto custom-scrollbar">
                <h2 className="text-xl font-bold mb-4">情報編集</h2>
                <div className="space-y-4">
                  <TextField
                    select
                    label="案件名"
                    value={workName} // Use `value` instead of `defaultValue`
                    onChange={(e) => setWorkName(e.target.value)}
                    className="w-full border border-gray-300 rounded"
                    SelectProps={{
                      MenuProps: {
                        disableScrollLock: true,
                      },
                    }}
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
                  <TextField
                    select
                    label="物件名"
                    value={flatName} // Use `value` instead of `defaultValue`
                    onChange={(e) => setFlatName(e.target.value)}
                    className="w-full border border-gray-300 rounded "
                    SelectProps={{
                      MenuProps: {
                        disableScrollLock: true,
                      },
                    }}
                  >
                    {flats.map((flat, index) => (
                      <MenuItem key={flat.id} value={flat.name}>
                        {flat.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <div className="w-full flex gap-3">
                    <TextField
                      label="部屋番号"
                      type="number"
                      value={roomNum}
                      onChange={(e) => setRoomNum(Number(e.target.value) || 0)}
                      variant="outlined"
                      className="w-[40%] border border-gray-300 rounded"
                    />
                    <TextField
                      select
                      label="カギの管理状況"
                      value={keyManagement ? keyManagement : "事前用意"} // Use `value` instead of `defaultValue`
                      onChange={(e) =>
                        setKeyManagement(
                          e.target.value as "事前用意" | "弊社管理",
                        )}
                      className="w-[60%] border border-gray-300 rounded "
                      SelectProps={{
                        MenuProps: {
                          disableScrollLock: true,
                        },
                      }}
                    >
                      <MenuItem value="事前用意">
                        事前用意
                      </MenuItem>
                      <MenuItem value="弊社管理">
                        弊社管理
                      </MenuItem>
                    </TextField>
                  </div>
                  <div className="w-full flex gap-3">
                    <TextField
                      type="date"
                      label="開始期間"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      variant="outlined"
                      className="w-[50%] border border-gray-300 rounded"
                    />
                    <TextField
                      type="date"
                      label="終了期間"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      variant="outlined"
                      className="w-[50%] border border-gray-300 rounded"
                    />
                  </div>

                  <TextField
                    label="ホースの長さ(m)"
                    type="number"
                    value={hoseLength ? hoseLength : 0}
                    onChange={(e) => setHoseLength(Number(e.target.value) || 0)}
                    variant="outlined"
                    className="border border-gray-300 rounded w-full"
                  />
                  <TextField
                    label="班数（〇人）"
                    type="number"
                    value={teamSize ? teamSize : 0}
                    onChange={(e) => setTeamSize(e.target.value)}
                    variant="outlined"
                    className="border border-gray-300 rounded w-full"
                  />
                  <TextField
                    label="作業時間（〇時間）"
                    type="number"
                    value={workDuration ? workDuration : 0}
                    onChange={(e) => setWorkDuration(e.target.value)}
                    variant="outlined"
                    className="border border-gray-300 rounded w-full"
                  />

                  <TextField
                    label="ホースの設置・降ろす位置"       
                    type="text"
                    value={hosePlacement ? hosePlacement : ""}
                    onChange={(e) => setHosePlacement(e.target.value)}
                    variant="outlined"
                    className="w-full border border-gray-300 rounded w-full"
                  />
                  <TextField
                    label="必要な道具"
                    type="text"
                    value={requiredTools ? requiredTools : ""}
                    onChange={(e) => setRequiredTools(e.target.value)}
                    variant="outlined"
                    className="w-full border border-gray-300 rounded"
                  />
                  <TextField
                    label="注意事項・引き継ぎ事項"
                    multiline
                    value={notes ? notes : ""}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    variant="outlined"
                    className="w-full border border-gray-300 rounded"
                  />
                  <div className="w-full flex gap-3">
                    <FormGroup className="w-1/2">
                      {checkboxOptions.slice(
                        0,
                        Math.ceil(checkboxOptions.length / 2),
                      ).map(({ key, label }) => (
                        <FormControlLabel
                          key={key}
                          control={
                            <Android12Switch
                              checked={checkboxList[
                                key as keyof typeof checkboxList
                              ]}
                              onChange={(e) =>
                                setCheckboxList((prev) => ({
                                  ...prev,
                                  [key]: e.target.checked,
                                }))}
                            />
                          }
                          label={label}
                        />
                      ))}
                    </FormGroup>
                    <FormGroup className="w-1/2">
                      {checkboxOptions.slice(
                        Math.ceil(checkboxOptions.length / 2),
                      ).map(({ key, label }) => (
                        <FormControlLabel
                          key={key}
                          control={
                            <Android12Switch
                              checked={checkboxList[
                                key as keyof typeof checkboxList
                              ]}
                              onChange={(e) =>
                                setCheckboxList((prev) => ({
                                  ...prev,
                                  [key]: e.target.checked,
                                }))}
                            />
                          }
                          label={label}
                        />
                      ))}
                    </FormGroup>
                  </div>
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
          {modalContent?.type === "create" && (
            <div className="flex inset-0 items-center justify-center bg-black bg-opacity-50">
              <div className="bg-[#FFFFFF] p-6 rounded-[10px] shadow-lg w-full">
                <h2 className="text-xl font-bold mb-4">新規案件</h2>
                <div className="space-y-4">
                  <TextField
                    select
                    label="案件名"
                    value={workName} // Use `value` instead of `defaultValue`
                    onChange={(e) => setWorkName(e.target.value)}
                    className="w-full border border-gray-300 rounded"
                    SelectProps={{
                      MenuProps: {
                        disableScrollLock: true,
                      },
                    }}
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
                  <TextField
                    select
                    label="物件名"
                    value={flatName} // Use `value` instead of `defaultValue`
                    onChange={(e) => setFlatName(e.target.value)}
                    className="w-full border border-gray-300 rounded "
                    SelectProps={{
                      MenuProps: {
                        disableScrollLock: true,
                      },
                    }}
                  >
                    {flats.map((flat, index) => (
                      <MenuItem key={flat.id} value={flat.name}>
                        {flat.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <div className="w-full flex gap-3">
                    <TextField
                      label="部屋番号"
                      type="number"
                      value={roomNum}
                      onChange={(e) => setRoomNum(Number(e.target.value) || 0)}
                      variant="outlined"
                      className="w-[40%] border border-gray-300 rounded"
                    />
                    <TextField
                      select
                      label="カギの管理状況"
                      value={keyManagement} // Use `value` instead of `defaultValue`
                      onChange={(e) =>
                        setKeyManagement(
                          e.target.value as "事前用意" | "弊社管理",
                        )}
                      className="w-[60%] border border-gray-300 rounded "
                      SelectProps={{
                        MenuProps: {
                          disableScrollLock: true,
                        },
                      }}
                    >
                      <MenuItem value="事前用意">
                        事前用意
                      </MenuItem>
                      <MenuItem value="弊社管理">
                        弊社管理
                      </MenuItem>
                    </TextField>
                  </div>
                  <div className="w-full flex gap-3">
                    <TextField
                      type="date"
                      label="開始時間"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      variant="outlined"
                      className="w-[50%] border border-gray-300 rounded"
                    />
                    <TextField
                      type="date"
                      label="終了時間"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      variant="outlined"
                      className="w-[50%] border border-gray-300 rounded"
                    />
                  </div>
                  <div className="w-full flex gap-3">
                    <TextField
                      label="ホースの長さ(m)"
                      type="number"
                      value={hoseLength}
                      onChange={(e) =>
                        setHoseLength(Number(e.target.value) || 0)}
                      variant="outlined"
                      className="border border-gray-300 rounded"
                    />
                    <TextField
                      label="班数（人）"
                      type="text"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      variant="outlined"
                      className="border border-gray-300 rounded"
                    />
                    <TextField
                      label="作業期間（時間）"
                      type="text"
                      value={workDuration}
                      onChange={(e) => setWorkDuration(e.target.value)}
                      variant="outlined"
                      className="border border-gray-300 rounded"
                    />
                  </div>
                  <TextField
                    label="ホースの設置・降ろす位置"
                    type="text"
                    value={hosePlacement}
                    onChange={(e) => setHosePlacement(e.target.value)}
                    variant="outlined"
                    className="w-full border border-gray-300 rounded"
                  />
                  <TextField
                    label="必要な道具"
                    type="text"
                    value={requiredTools}
                    onChange={(e) => setRequiredTools(e.target.value)}
                    variant="outlined"
                    className="w-full border border-gray-300 rounded"
                  />
                  <TextField
                    label="注意事項・引き継ぎ事項"
                    multiline
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    variant="outlined"
                    className="w-full border border-gray-300 rounded"
                  />
                  <div className="w-full flex gap-3">
                    <FormGroup className="w-1/2">
                      {checkboxOptions.slice(
                        0,
                        Math.ceil(checkboxOptions.length / 2),
                      ).map(({ key, label }) => (
                        <FormControlLabel
                          key={key}
                          control={
                            <Android12Switch
                              checked={checkboxList[
                                key as keyof typeof checkboxList
                              ]}
                              onChange={(e) =>
                                setCheckboxList((prev) => ({
                                  ...prev,
                                  [key]: e.target.checked,
                                }))}
                            />
                          }
                          label={label}
                        />
                      ))}
                    </FormGroup>
                    <FormGroup className="w-1/2">
                      {checkboxOptions.slice(
                        Math.ceil(checkboxOptions.length / 2),
                      ).map(({ key, label }) => (
                        <FormControlLabel
                          key={key}
                          control={
                            <Android12Switch
                              checked={checkboxList[
                                key as keyof typeof checkboxList
                              ]}
                              onChange={(e) =>
                                setCheckboxList((prev) => ({
                                  ...prev,
                                  [key]: e.target.checked,
                                }))}
                            />
                          }
                          label={label}
                        />
                      ))}
                    </FormGroup>
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
                    onClick={handleDelte} // This will trigger the deletion action
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
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
