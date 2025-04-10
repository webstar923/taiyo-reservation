import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/fetchUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
const BASE_URL = `${API_BASE_URL}/reservation/deleteReservation`;
export async function POST(req: Request) {
  try {  
   
    const requestBody = await req.json();
    const response = await fetchWithAuth(BASE_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'       
      },
      body: JSON.stringify(requestBody),     
    });

    // Check if the response is JSON
    if (response.ok) {
      // Check if the response is of type JSON
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return NextResponse.json(data, { status: 201 });
      } else {
        // If not JSON, log the raw response
        const rawResponse = await response.text();
        console.error("Expected JSON but got:", rawResponse);
        return NextResponse.json({ message: "Unexpected response format" }, { status: 500 });
      }
    } else {
      // Handle HTTP errors
      console.error(`Error fetching data from API: ${response.status} ${response.statusText}`);
      return NextResponse.json({faleStatus:true, message: `API call failed: ${response.status}` }, { status: 500 });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

