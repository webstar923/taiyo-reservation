import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/fetchUtils';

const UPLOAD_BASE_URL = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL || 'http://localhost:5000/upload';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type');
    console.log('Content-Type:', contentType); // ✅ デバッグ用

    if (!contentType || !contentType.startsWith('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid Content-Type' }, { status: 400 });
    }

    const formData = await req.formData(); // ✅ ここで失敗していた
    console.log('Received formData:', formData); // ✅ 確認用

    const res = await fetchWithAuth(UPLOAD_BASE_URL, {
      method: 'POST',
      body: formData, // ✅ 正しく送信
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Server Error:', errorText);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Fetch failed:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
