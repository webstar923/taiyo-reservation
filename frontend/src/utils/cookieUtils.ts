import { cookies } from 'next/headers';

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  maxAge?: number;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
}

// Function to set a cookie
export const setCookie = async (
  name: string,
  value: string,
  options: CookieOptions = {}
) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: true, // Prevents client-side JavaScript access
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production (HTTPS)
    sameSite: 'lax', // Adjust based on your requirements
    path: '/', // Cookie will be available across the whole site
    ...options, // Allow custom options (like maxAge)
  });
};

// Function to delete a cookie
export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};

// Function to get a cookie value
export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  return cookie ? cookie.value : null;
};
