import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/fetchUtils';

const UPLOAD_BASE_URL = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL || 'http://localhost:5000/uploadFlatInfoFile';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type');
    console.log('Content-Type:', contentType); // ✅ デバッグ用

    if (!contentType || !contentType.startsWith('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid Content-Type' }, { status: 400 });
    }

    const formData = await req.formData(); // ✅ ここで失敗していた

    const res = await fetchWithAuth("http://localhost:5000/uploadFlatInfoFile", {
      method: 'POST',
      body: formData, // ✅ 正しく送信
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Server Error:', errorText);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: res.status });
    }

    const data = await res.json();
    console.log('Received formData:', data); 

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Fetch failed:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
