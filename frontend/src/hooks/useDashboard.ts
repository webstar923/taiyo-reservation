import { useState, useEffect } from 'react';
import { useNotificationData } from '@/state/notificationNum';

export const useDashboard = () => {
  const { setField } = useNotificationData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchError = async (res: Response) => {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Fetching failed');
  };

  const fetchData = async (url: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' }, ...options });
      
      if (!res.ok) {
        await handleFetchError(res);
      }

      return await res.json();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get Flat Data
  const getFlatData = async () => fetchData('/api/flat/getAllData');

  // Get API Log Data
  const getApiLogData = async (pageNum: number, searchTerm: string) => {
    if (searchTerm === "") {
      searchTerm = "!allData!";
    }
    return fetchData(`/api/log/getApiLogData/${pageNum}/${searchTerm}`);
  };

  // Get Notifications
  const getNotification = async () => fetchData('/api/log/getNotification');

  // Mark as Read
  const markAsRead = async (id: number) => fetchData(`/api/log/getNotification/${id}`);

  // Get Dashboard Data
  const getDashboardData = async () => fetchData('/api/reservation/getDashboardData');

  // Get Reservation List Data
  const getReservationListData = async (startTime: string, endTime: string) => {
    return fetchData('/api/reservation/getReservationListData', {
      method: 'POST',
      body: JSON.stringify({ startTime, endTime }),
    });
  };

  // Update Reservation
  const updateReservation = async (body: any) => {
    return fetchData('/api/reservation/updateReservation', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  // Get Work Data
  const getWorkData = async () => fetchData('/api/work/getAllData');

  // Get User Data
  const getUserData = async () => fetchData('/api/user/getAllData');

  // Get Error Log Data
  const getErrorLogData = async () => fetchData('/api/log/getErrorData');

  // Get Change Log Data
  const getChangeLogData = async () => fetchData('/api/log/getChangeData');

  // Get Notification Number
  const getNotificationNum = async () => {
    const data = await fetchData('/api/log/getNotificationNum');
    setField('Notification_Num', data.NotificationNum);
    setField('Message_Num', data.MessageNum);
    return data;
  };

  // Other Methods (Create/Update/Delete)
  const createFlat = async (body: any) => fetchData('/api/flat/createFlat', { method: 'POST', body: JSON.stringify(body) });
  const createWork = async (body: any) => fetchData('/api/work/createWork', { method: 'POST', body: JSON.stringify(body) });
  const createUser = async (body: any) => fetchData('/api/user/createUser', { method: 'POST', body: JSON.stringify(body) });

  const changeFlat = async (body: any) => fetchData('/api/flat/changeFlat', { method: 'POST', body: JSON.stringify(body) });
  const changeWork = async (body: any) => fetchData('/api/work/changeWork', { method: 'POST', body: JSON.stringify(body) });
  const changeUser = async (body: any) => fetchData('/api/user/changeUser', { method: 'POST', body: JSON.stringify(body) });

  const deleteFlat = async (id: number) => fetchData('/api/flat/deleteFlat', { method: 'POST', body: JSON.stringify({ id }) });
  const deleteWork = async (id: number) => fetchData('/api/work/deleteWork', { method: 'POST', body: JSON.stringify({ id }) });
  const deleteUser = async (id: number) => fetchData('/api/user/deleteUser', { method: 'POST', body: JSON.stringify({ id }) });
  const deleteReservation = async (id: number) => fetchData('/api/reservation/deleteReservation', { method: 'POST', body: JSON.stringify({ id }) });

  const createReservation = async (body: any) => fetchData('/api/reservation/createReservation', { method: 'POST', body: JSON.stringify(body) });

  const uploadReservationData = async (body: FormData) => fetch('/api/reservation/uploadReservationData', {method: 'POST',  body });
 

  return {
    getFlatData, changeFlat, createFlat, deleteFlat, getWorkData, createWork, changeWork, deleteWork,
    getUserData, changeUser, deleteUser, createUser, getErrorLogData, getChangeLogData, getApiLogData,
    getNotificationNum, getNotification, markAsRead, getReservationListData, updateReservation, deleteReservation,
    createReservation, getDashboardData, loading, error,uploadReservationData
  };
};
