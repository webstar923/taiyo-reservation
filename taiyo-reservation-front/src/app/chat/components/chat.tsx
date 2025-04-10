import React, { useState, useEffect, useRef  } from 'react';
import Typewriter from 'typewriter-effect';
import { useChatStore } from '@/state/chatStore';
import { useChatHandler } from '@/hooks/useChatHandler';
import Button from '@/app/chat/components/buttonComponent';
import Image from "next/image";
import clsx from "clsx";


interface Option {
  id: string;
  reservation_time: string;
  division: string;
  work_name?: string;
  name?: string;
  address?: string;
  type?: string;
  flat_name: string;
  room_num: string;
  description?: string;
  availableDates?: string[];
  [key: string]: unknown; // You can add more dynamic fields if needed
};


const Chat = () => {
  const { chatData, resetForm } = useChatStore(); 
  const [showOptions, setShowOptions] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('null');
  const hasMounted = useRef(false);
  const typingDelay = 25;
  
  const { messages, handleButtonClick, handleInputEnterPress, 
          handleSelectClick, handleBackClick
        } = useChatHandler();
  
  useEffect(() => {
    if (!hasMounted.current) {
      resetForm();
    }
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.type === 'button') {
      const totalTypingTime = lastMessage.content.length * typingDelay;
      setShowOptions(false);
      setTimeout(() => {
        setShowOptions(true);
      }, totalTypingTime);
    }
    setTimeout(() => {
      if (messageEndRef.current) {      
        messageEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 1000);
    
    hasMounted.current = true;
  }, [messages, resetForm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>,reqType:string) => {
    if (e.key === 'Enter') {
      
      handleInputEnterPress(inputValue,reqType[0]);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="flex flex-col w-full gap-[10px] pr-5"  style={{ maxHeight: '800px', overflowY: 'scroll' }}>
      {messages.map((message, index) => (
        <div key={index} className={`flex gap-2 mt-3 ${messages.length !== 1 && messages.length!== index+1 && "pointer-events-none"}`}>
          <Image
            src="/assets/images/avatars/avatar.png"
            alt="Avatar"
            width={100}   
            height={100} 
            className="flex w-[80px] h-[80px] rounded-full border-2 border-[#83d0e4]"
          />
          <div className="flex flex-col flex-wrap w-full relative font-normal leading-[28px] text-[#6C73A8] text-[17px] break-all">
              <Typewriter
                options={{
                  strings: message.content,
                  autoStart: true,
                  loop: false,
                  deleteSpeed: 100,
                  delay: 1, // Adjusted delay for a better effect
                }}
              />
            
            {message.type === 'button' && (
              <div className="flex w-full gap-3 flex-wrap mt-[10px]">
                  {message.options && message.options.map((option:string, idx:number) => (
                    <div key={idx}
                      className={`border border-[#c8ceed] px-[20px] py-[10px] rounded-[5px] hover:border-[#0a1551] text-[#6C73A8] hover:bg-[#dadef3] cursor-pointer ${chatData.requirement ===　option  ? "bg-[#0f1430] text-white" : "bg-white"}`}
                      onClick={() => {handleButtonClick(option,'button');}}
                    >
                      <p className="font-normal leading-[28px]  text-[15px] break-all">{option}</p>
                    </div>
                  ))}
              </div>
            )}
             {message.type === 'input' && (
              <div className="flex gap-3 flex-wrap mt-[10px]">
                <input 
                  type="text"  
                  onChange={handleInputChange}
                  onKeyDown={(e)=>{handleKeyDown(e,message.reqType)}} 
                  className="top-[50px] w-[65vw] text-[20px] bg-[#dfe1ee]  border-none rounded-[5px] px-[10px] py-[5px] border-[0px] sm:w-[30vw] focus:outline-none focus:border-none" 
                  placeholder="ここに入力してください..."
                />
              </div>
            )}
            {message.type === 'select' && (
              <div className="flex flex-col w-full gap-3 flex-wrap mt-[10px]">
                {Array.isArray(message.options) &&
                  message.options.map((option: Option, idx: number) => {
                    
                    const fieldMap: Record<string, keyof typeof option> = {
                      work: "work_name",
                      name: "name",
                      address: "address",
                      type: "type",
                      description: "description",
                      availableDates: "availableDates"
                    };

                    const columnKey = message.column?.[0] ?? ""; 
                    const displayValue = columnKey && fieldMap[columnKey] ? option[fieldMap[columnKey]] : "";
                    
                      return (
                        <div key={idx} className="flex gap-5">
                          <label 
                            className="flex items-center gap-2 cursor-pointer text-orange-950" 
                            onClick={() => setSelectedValue(displayValue ? String(displayValue) : String(option))}>
                            <input 
                              type="radio" 
                              name={message.column[0]}  
                              value={displayValue ? String(displayValue) : String(option)} 
                              required 
                            />
                            {displayValue ? String(displayValue) : String(option)}
                          </label>
                        </div>
                      );
                    
                  })}
                <div className="flex gap-6">  
                  <Button label='次へ' onClickHandler={()=>handleSelectClick(selectedValue,message.reqType[0])}/>
                  <Button label='戻る' onClickHandler={()=>handleBackClick()}/>
                </div>  
              </div>
            )}
            {message.type === 'reservationView' && (
              <div className="flex flex-col w-full gap-3 flex-wrap mt-[10px] relative  ">
                <div 
                  className={clsx(
                    "relative w-[90%] sm:w-[40%] rounded-[10px] border border-black/10 bg-no-repeat mt-8 p-7 overflow-hidden bg-contain bg-center",
                    message.state === "OK"
                      ? "bg-[url('/assets/images/check_bg.png')] shadow-[3px_2px_34px_0px_rgba(0,210,0,0.5)]"
                      : "shadow-[1px_2px_20px_0px_rgba(0,0,0,0.4)]"
                  )}
                >
                <div className="absolute inset-0 bg-white/70"></div>
                  <p className="font-semibold text-[20px] leading-[25.5px] text-[#091428] opacity-100 relative">
                    予約番号：{message.options.id}
                  </p>
                  <div className="flex gap-6 justify-between mt-6 relative">
                    <div className=" flex-col hidden sm:flex">
                      <div className="relative ml-0 m-auto">
                        <Image
                          className="select-none rounded-4"
                          src="/assets/images/tree.png"
                          alt="tree"
                          width={100}
                          height={100}
                        />
                      </div>
                      <p className="font-semibold text-[32px] leading-[40px] tracking-[-0.05em] text-[#091428]">Full Value</p>
                    </div>
                    <div className="flex flex-col gap-2 my-[9px]">
                      <p className="font-normal text-5 leading-[19px] text-[#091428]">{message.options.flat_name}</p>
                      <p className="font-normal text-4 leading-[14px] text-[#858688]">物件名</p>
                      <hr />
                      <p className="font-normal text-5 leading-[19px] text-[#091428]">{message.options.room_num}</p>
                      <p className="font-normal text-4 leading-[14px] text-[#858688]">部屋番号</p>
                      <hr />
                      <p className="font-normal text-5 leading-[19px] text-[#091428]">{new Date(message.options.reservation_time).toLocaleDateString('en-CA')}</p>
                      <p className="font-normal text-4 leading-[14px] text-[#858688]">予約⽇</p>
                      <hr />
                      <p className="font-normal text-5 leading-[19px] text-[#091428]">{message.options.division}</p>
                      <p className="font-normal text-4 leading-[14px] text-[#858688]">予約区分</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-6">  
                  <Button label={message.reqType[0]} onClickHandler={()=>handleButtonClick(message.reqType[0],message.options.id)}/>
                  <Button label={message.reqType[1]} onClickHandler={()=>handleButtonClick(message.reqType[1],message.options.id)}/>
                </div>  
              </div>
            )}
            {message.type === 'viewReservationList' && (
              <div className="p-5 max-w-full overflow-x-auto">
                <div className="hidden sm:block w-full overflow-auto max-w-[700px]">
                  <table className="w-full table-auto border border-gray-300 ">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left bg-gray-100 font-bold border-b-2 border-gray-300">予約番号</th>
                        <th className="px-4 py-3 text-left bg-gray-100 font-bold border-b-2 border-gray-300">物件名</th>
                        <th className="px-4 py-3 text-left bg-gray-100 font-bold border-b-2 border-gray-300">部屋番号</th>
                        <th className="px-4 py-3 text-left bg-gray-100 font-bold border-b-2 border-gray-300">作業内容</th>
                        <th className="px-4 py-3 text-left bg-gray-100 font-bold border-b-2 border-gray-300">予約時間</th>
                        <th className="px-4 py-3 text-left bg-gray-100 font-bold border-b-2 border-gray-300">時間帯</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        message.options && message.options.length > 0 && (
                          message.options.map((option: Option, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-100 even:bg-gray-50 odd:bg-white">
                              <td className="px-4 py-3 border-b border-gray-300">{option.id}</td>
                              <td className="px-4 py-3 border-b border-gray-300">{option.flat_name}</td>
                              <td className="px-4 py-3 border-b border-gray-300">{option.room_num}</td>
                              <td className="px-4 py-3 border-b border-gray-300">{option.work_name}</td>
                              <td className="px-4 py-3 border-b border-gray-300">{option.reservation_time}</td>
                              <td className="px-4 py-3 border-b border-gray-300">{option.division}</td>
                            </tr>
                          ))
                        )
                      }
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col w-full gap-3 flex-wrap mt-[10px] relative sm:hidden ">
                  <div 
                    className={clsx(
                      "relative w-[90%] sm:w-[40%] rounded-[10px] border border-black/10 bg-no-repeat mt-8 p-7 overflow-hidden bg-contain bg-yellow-100",
                      message.state === "OK"
                        ? "bg-[url('/assets/images/check_bg.png')] shadow-[3px_2px_34px_0px_rgba(0,210,0,0.5)]"
                        : "shadow-[1px_2px_20px_0px_rgba(0,0,0,0.4)]"
                    )}
                  >
                     {
                        message.options && message.options.length > 0 && (
                          message.options.map((option: Option, idx: number) => (
                            <div className="sm:hidden p-4">
                            <p className="font-semibold text-lg text-[#091428]">予約番号：{option.id}</p>
                          
                            <div className="flex flex-col gap-2 mt-4">
                              <div>
                                <p className="text-base text-[#091428]">{option.flat_name}</p>
                                <p className="text-sm text-[#858688]">物件名</p>
                              </div>
                              <hr />
                          
                              <div>
                                <p className="text-base text-[#091428]">{option.room_num}</p>
                                <p className="text-sm text-[#858688]">部屋番号</p>
                              </div>
                              <hr />
                          
                              <div>
                                <p className="text-base text-[#091428]">{new Date(option.reservation_time).toLocaleDateString('en-CA')}</p>
                                <p className="text-sm text-[#858688]">予約⽇</p>
                              </div>
                              <hr />
                          
                              <div>
                                <p className="text-base text-[#091428]">{option.division}</p>
                                <p className="text-sm text-[#858688]">予約区分</p>
                              </div>
                            </div>
                          </div>
                           
                        )))}   
                   </div>
                  </div>
                <div className="flex gap-6 mt-5 justify-end">  
                  <Button  label='戻る' onClickHandler={()=>handleButtonClick("戻る",'')}/>
                </div>
              </div>
            )}
            <div ref={messageEndRef} className="mt-[60px]"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chat;
