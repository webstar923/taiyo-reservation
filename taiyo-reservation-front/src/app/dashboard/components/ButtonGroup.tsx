// import { useState } from 'react';
// import GridIcon from '@/../../public/assets/icons/dashboard2.svg';
// import CheckIcon from '@/../../public/assets/icons/check.svg';
// import SummaryIcon from '@/../../public/assets/icons/summary.svg';

// type Props = {}

// const ButtonGroup = (props: Props) => {
//   const [activeView, setActiveView] = useState("grid");
//   return (
//     <div className="flex items-center justify-center">
//       <div className="flex rounded-full border border-gray-300 overflow-hidden">
//         {/* Grid View Option */}
//         <button
//           className={`flex items-center justify-center w-[3.4rem] h-[2rem] rounded-l-full border-r border-solid ${
//             activeView === "grid" ? "bg-gray-100" : "bg-white"
//           }`}
//           onClick={() => setActiveView("grid")}
//         >
//           <div className="flex flex items-center ">
//             {/* Grid Icon */}
//             <GridIcon className="w-4 h-4 text-[#00A0FF] mr-1" />
//             <CheckIcon className="w-4 h-4 text-[#212529]" />
//           </div>
//         </button>

//         {/* List View Option */}
//         <button
//           className={`flex items-center justify-center w-[3.4rem] h-[2rem] rounded-r-full ${
//             activeView === "list" ? "bg-gray-100" : "bg-white"
//           }`}
//           onClick={() => setActiveView("list")}
//         >
//           {/* List Icon */}
//           <SummaryIcon className="w-4 h-4 text-[#858688]" />
//         </button>
//       </div>
//     </div>
//   )
// }

// export default ButtonGroup;