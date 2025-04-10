import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/fetchUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
const BASE_URL = `${API_BASE_URL}/reservation/createReservation`


export async function POST(req: Request) {
  try {

    const requestBody = await req.json();
    const res = await fetchWithAuth(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Server Error:', errorText);
      return NextResponse.json({ error: 'Failed to create album' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Fetch failed:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}