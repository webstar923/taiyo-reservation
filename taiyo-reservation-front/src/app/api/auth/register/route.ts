import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
    const requestBody = await req.json();
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    // Get the raw response body to inspect it
    const responseText = await response.text();
   

    if (!response.ok) {
      // Handle specific error codes like 409 (Conflict)
      if (response.status === 409) {
        return NextResponse.json(
          { message: 'This email is already registered.' },
          { status: 409 }
        );
      }

      // Handle other errors
      const errorData = responseText ? JSON.parse(responseText) : { message: 'Error during registration' };
      console.log("register data error----------------",errorData);
      return NextResponse.json(errorData, { status: response.status });
    }

    // Registration successful, return 201 status
    const data = responseText ? JSON.parse(responseText) : {};
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error during registration:', error);
    // Return a generic error response for unexpected errors
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
