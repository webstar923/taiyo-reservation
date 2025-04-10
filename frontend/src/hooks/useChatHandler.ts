import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/state/chatStore';
import { chatMessages } from '@/data/chatMessages';

export const useChatHandler = () => {
  const { chatData, setField,resetForm } = useChatStore();
  const [messages, setMessages] = useState<any[]>([]); 
  const hasMounted = useRef(false);  

  const addMessage = (newMessage: any) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };
  const removeMessage = () => {
    setMessages((prevMessages) => prevMessages.slice(0, prevMessages.length - 1));
  };

  useEffect(() => {
    if (!hasMounted.current) {
      addMessage(chatMessages.welcome);
    }    
    hasMounted.current = true;
  }, [chatMessages]);

  const handleButtonClick = async (option: string, value:string) => {
    if (option === "変更する") {
      const res = await fetch('/api/reservation/findChangeDate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({reservation_id:value}),
      });
      setField('changeReservationId',value);      
      const data = await res.json();
      chatMessages.selectReservationDate.options = data.availableDates;
      if (!data.availableDates || data.availableDates.length === 0){
        return addMessage(chatMessages.findUpdateDateError);;
      }
      return addMessage(chatMessages.selectReservationDate);
    } else if(option === "はい"){
      const res = await fetch('/api/reservation/updateReservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({id:chatData.changeReservationId, reservation_time:chatData.changeReservationDate,division:chatData.changeReservationDivision}),
      });
    
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'search failed');
      }
      const data = await res.json();            
      chatMessages.ReservationChangeSucess.options = data;
      chatMessages.ReservationChangeSucess.state = "OK";      
      return addMessage(chatMessages.ReservationChangeSucess);
    } else if(option === "いいえ" || option === "戻る"|| option === "次へ"  || option === "終了" || option === "変更しない"){
      resetForm(); 
      return addMessage(chatMessages.welcomeAgain);
    }   
    resetForm();     
    setField('requirement',option);
    return addMessage(chatMessages[option]);
  };
  const handleInputEnterPress = async (value:string,reqType:string) =>{
    if (reqType === "findFlat") {
      const res = await fetch('/api/reservation/findFlat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({name:value}),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      const data = await res.json();
      if(!data.dataValues){
        return addMessage(chatMessages.inputFlatError);
      }else{
        setField("flatName",value);
        chatMessages.inputFlatSucess.options = data.dataValues;
        return addMessage(chatMessages.inputFlatSucess);
      }   
    } else if (reqType === "inputRoomNum") {
      if (Number(value) || Number(value) === 0) {
        
        const res = await fetch('/api/reservation/findWork', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({room_num:value,flat_name:chatData.flatName}),
        });      
       
        const data = await res.json();       
        
        if(!!data.message){
          return addMessage(chatMessages.inputRoomNumNullError);
        }
        setField("roomNum",value);
        if(chatData.requirement === "予約照会"){
          const res = await fetch('/api/reservation/getReservations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json'},
              body: JSON.stringify({flat_name:chatData.flatName,room_num:value}),        
            });
          
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message || 'search failed');
            }
            const data = await res.json();
            chatMessages.viewReservationList.options = data;
            return addMessage(chatMessages.viewReservationList);
        }else if(chatData.requirement === "予約変更"){
          chatMessages.inputRoomNumSucess_edit.options = data;
          return addMessage(chatMessages.inputRoomNumSucess_edit);
        }
      } else {
        return addMessage(chatMessages.inputRoomNumError)
      }
    } else if(reqType === "viewReservation"){
      if (Number(value) || Number(value) === 0) {
        
        const res = await fetch('/api/reservation/findReservation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({reservation_id:value}),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'search failed');
        }
        const data = await res.json();
        console.log(data);
        if (!!data.message) {
          return addMessage(chatMessages.inputBookedReservationNumNullError);
        }
        setField("changeReservationId",value);
        chatMessages.changeableReservation.options = data.dataValues[0];
        return addMessage(chatMessages.changeableReservation);
      } else {
        return addMessage(chatMessages.inputBookedReservationNumError);
      }
    }
  }
  const handleSelectClick = async (value:string, reqType:string) =>{     
    if (reqType === "selectFlat") {          
      if (String(value) === "null") {   
        return addMessage(chatMessages.selectFlatError);        
      }else{
        setField('flatName',value);     
        return addMessage(chatMessages.inputRoomNum);
      }
    } else if (reqType === "selectWork"){   
      if (String(value) === "null") {  
        setTimeout(() => {
          removeMessage();
        }, 300);
        return addMessage(chatMessages.selectWorkError);
      }else{  
        setField('workName', value);
        if (chatData.requirement === "新しい予約") {
          const res = await fetch('/api/reservation/getChangeableDate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({work_name:value,flat_name:chatData.flatName,room_num:chatData.roomNum}),
          });
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'search failed');
          }
          const data = await res.json();
          chatMessages.selectReservationDate.options = data.availableDates;
          return addMessage(chatMessages.selectReservationDate);
        }else if(chatData.requirement === "予約変更"){
          console.log(value,"this is hook work name")
          // return addMessage(chatMessages.inputBookedReservationNum);         
          const res = await fetch('/api/reservation/findReservationByRoomNum', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({flat_name:chatData.flatName,room_num:chatData.roomNum,work_name:value}),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'search failed');
          }
          
          const data = await res.json();
          console.log("this is data message ",data);
          
          if (!!data.message) {
            return addMessage(chatMessages.findReservationError);
          }
          
          const id = data.dataValues[0].id;
          setField("changeReservationId",id);
          chatMessages.changeableReservation.options = data.dataValues[0];
          return addMessage(chatMessages.changeableReservation);
          
        }
      }      
    } else if(reqType === "selectDivision"){      
            
      if (isNaN(new Date(value).getTime())) {
        return;
      }
      setField('changeReservationDate', value);
      return addMessage(chatMessages.selectDivision);
    }else if(reqType === "reservate"){
      setField('changeReservationDivision', value);
      if (chatData.requirement === "新しい予約") {
        const res = await fetch('/api/reservation/createReservation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({flat_name:chatData.flatName,room_num:chatData.roomNum,work_name:chatData.workName,reservation_time:chatData.changeReservationDate,division:value}),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'search failed');
        }
        const data = await res.json();
        chatMessages.bookedReservation.options = data;
        console.log(data);      
        return addMessage(chatMessages.bookedReservation);
      }else if (chatData.requirement === "予約変更"){
        if (!isNaN(new Date(value).getTime())) {
          return;
        }
        const res = await fetch('/api/reservation/findReservation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({reservation_id:chatData.changeReservationId}),
        });
      
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'search failed');
        }
        const data = await res.json();
        if (data.dataValues && data.dataValues.length > 0) {
          data.dataValues[0].reservation_time = chatData.changeReservationDate; // Update reservation_time
          data.dataValues[0].division = value; // Update division
        }              
        setField('changeReservationDivision', value);
        chatMessages.changeReservation.options = data.dataValues[0];        
        return addMessage(chatMessages.changeReservation);
      }
    }  
  }
  const handleBackClick = async () =>{
    removeMessage();
  }
  return { messages, handleButtonClick,handleInputEnterPress,handleSelectClick, handleBackClick };
};
 