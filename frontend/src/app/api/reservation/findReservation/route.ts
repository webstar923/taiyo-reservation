import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/fetchUtils';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
const BASE_URL = `${API_BASE_URL}/reservation/findReservation`;
export async function POST(req: Request) {
  try {
    
    
    const requestBody = await req.json();
    const res = await fetchWithAuth(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody),
    });

    // Get the raw response body to inspect it
    const responseText = await res.text();
    const data = responseText ? JSON.parse(responseText) : {};      
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error during registration:', error);
    // Return a generic error response for unexpected errors
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
