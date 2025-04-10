import { getCookie } from './cookieUtils';

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
) => {
  const token = await getCookie('accessToken');

  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : '',
  };

  // Perform the fetch with the Authorization header
  const response = await fetch(url, {
    ...options,
    headers, // Add the headers to the request
    credentials: 'include', // Include cookies in the request (server-side only)
  });

  return response;
};
