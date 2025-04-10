import { NextResponse } from 'next/server';
import { setCookie } from '@/utils/cookieUtils';

export async function POST(req: Request) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    // Parse the request body to extract the refreshToken
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Send the refreshToken to the backend API for validation and refreshing
    const response = await fetch(`${API_BASE_URL}/authentication/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to refresh token' },
        { status: response.status }
      );
    }

    // Parse the response data
    const data = await response.json();

    // Set new accessToken and refreshToken in cookies
    const accessTokenCookie = setCookie('accessToken', data.accessToken, { maxAge: 15 * 60 });
    const refreshTokenCookie = setCookie('refreshToken', data.refreshToken, { maxAge: 60 * 60 * 24 * 30 });

    // Return the response with the cookies set
    const res = NextResponse.json({
      message: 'Tokens refreshed successfully',
    });

    // Attach cookies to the response
    res.headers.set('Set-Cookie', `${accessTokenCookie}, ${refreshTokenCookie}`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      { error: 'An error occurred while refreshing the token' },
      { status: 500 }
    );
  }
}
