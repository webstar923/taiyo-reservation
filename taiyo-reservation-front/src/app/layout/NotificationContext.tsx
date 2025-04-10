import { createContext, useContext, useState, ReactNode } from "react";

interface NotificationContextType {
  notificationNum: number;
  setNotificationNum: (num: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificationNum, setNotificationNum] = useState(0);

  return (
    <NotificationContext.Provider value={{ notificationNum, setNotificationNum }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  return context;
};
