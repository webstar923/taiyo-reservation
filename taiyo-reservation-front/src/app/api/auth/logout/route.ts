import { NextResponse } from 'next/server';
import { getCookie, deleteCookie } from '@/utils/cookieUtils';
import { fetchWithAuth } from '@/utils/fetchUtils';

export async function POST() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const refreshToken = await getCookie('refreshToken');

  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.message || 'Logout failed' },
        { status: res.status }
      );
    }

    await deleteCookie('accessToken');
    await deleteCookie('refreshToken');
    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Logout error:', error.message); // Log the error message
    }
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
