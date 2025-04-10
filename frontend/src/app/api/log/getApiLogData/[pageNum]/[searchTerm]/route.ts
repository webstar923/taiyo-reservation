// app/api/log/getApiLogData/route.ts
import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/fetchUtils';
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pageNum = url.pathname.split('/')[4];
    const searchTerm = url.pathname.split('/')[5] || '';

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

   
    const response = await fetchWithAuth(`${API_BASE_URL}/log/getApiLogData/${pageNum}/${searchTerm}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',       
      },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching API log data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
