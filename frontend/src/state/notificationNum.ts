import internal from 'stream';
import { create } from 'zustand';

interface NotificationData {
  NotificationNum: {
 
    Notification_Num: number;
    Message_Num: number;
    
  };
  setField: (key: keyof NotificationData['NotificationNum'], value: string | boolean | number) => void;
  resetForm: () => void;
}

export const useNotificationData = create<NotificationData>((set) => ({
  NotificationNum: { // Fixed typo from 'cahtData' to 'NotificationNum'
    
    Notification_Num:0,
    Message_Num:0
  },
  setField: (key, value) =>
    set((state) => ({
      NotificationNum: {
        ...state.NotificationNum,
        [key]: value,
      },
    })),
  resetForm: () =>
    set(() => ({
      NotificationNum: {
        Notification_Num:0,
        Message_Num:0
      },
    })),
}));
