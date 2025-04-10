import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

    const body = await req.json();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

    const res = await fetch(`${API_BASE_URL}/auth/password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorText = await res.text(); // Log the server's raw response for debugging
      console.error('Server Error:', errorText);
      return NextResponse.json({ error: 'Failed to login' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Now, you can safely access the properties of `error` such as `message`
      console.error('Fetch failed:', error.message);
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
    // If the error is not an instance of Error, handle accordingly
    console.error('Unknown error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
