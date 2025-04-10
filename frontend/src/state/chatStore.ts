import internal from 'stream';
import { create } from 'zustand';

interface ChatStore {
  chatData: {
    requirement: string;
    flatName: string;
    roomNum: number;
    workName:string;
    scheduledTask: string;    
    changeReservationId: number;
    changeReservationDate: string;
    changeReservationDivision: string;    
  };
  setField: (key: keyof ChatStore['chatData'], value: string | boolean | number) => void;
  resetForm: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatData: { // Fixed typo from 'cahtData' to 'chatData'
    requirement: '',
    flatName:'',
    roomNum:0,
    workName:'',
    scheduledTask:'',
    changeReservationId:0,
    changeReservationDate:'',
    changeReservationDivision:''

  },
  setField: (key, value) =>
    set((state) => ({
      chatData: {
        ...state.chatData,
        [key]: value,
      },
    })),
  resetForm: () =>
    set(() => ({
      chatData: {
        requirement: '',
        flatName: '',
        roomNum:0,
        workName:'',
        scheduledTask:'',
        changeReservationId:0,
        changeReservationDate:'',
        changeReservationDivision:''
      },
    })),
}));
