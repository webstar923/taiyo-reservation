import React from 'react';

const Spinner = () => {
  return (
    <div className="w-16 h-16 border-4 border-t-blue-500 border-r-green-500 border-b-red-500 border-l-pink-500 rounded-full animate-spin"></div>
    // <div className="flex justify-center items-center space-x-4">
    //   <div className="flex items-center justify-center h-screen">
    //     <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    //   </div>
    // </div>
  );
};

export default Spinner;
