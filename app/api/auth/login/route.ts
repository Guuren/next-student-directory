import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loginWithApi } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const { student_id, password } = await request.json();

    if (!student_id || !password) {
      return NextResponse.json(
        { message: 'Student ID and password are required.' },
        { status: 400 }
      );
    }

    const data = await loginWithApi(student_id, password);

    if (!data.token) {
      return NextResponse.json(
        { message: 'Authentication failed: No token returned.' },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();

    // Store token in cookie for Next.js SSR / Server Components
    cookieStore.set('auth_token', data.token, {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'lax',
      httpOnly: false, // Accessible to both client and server
    });

    if (data.student) {
      cookieStore.set('student_user', JSON.stringify(data.student), {
        path: '/',
        maxAge: 60 * 60 * 24,
        sameSite: 'lax',
        httpOnly: false,
      });
    }

    return NextResponse.json({
      success: true,
      token: data.token,
      student: data.student,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Login failed.' },
      { status: 401 }
    );
  }
}
