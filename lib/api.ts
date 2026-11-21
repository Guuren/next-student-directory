import { Student, LoginResponse } from '@/types/student';
import { getStudentsFromDatabase } from './db';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://ipt02-student-directory.netlify.app/api';

export async function loginWithApi(student_id: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed. Please check your credentials.');
  }

  return data;
}

export async function fetchStudentsFromApi(token: string): Promise<Student[]> {
  const res = await fetch(`${API_BASE}/students`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // We avoid Next.js caching here; caller controls cache behavior
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText}`);
  }

  return res.json();
}

/**
 * Fetch students using API with fallback to direct MySQL database query
 */
export async function getStudentsData(token?: string): Promise<{ students: Student[]; source: 'api' | 'mysql' }> {
  if (token) {
    try {
      const students = await fetchStudentsFromApi(token);
      return { students, source: 'api' };
    } catch (err) {
      console.warn('API fetch failed, falling back to direct MySQL:', err);
    }
  }

  const students = await getStudentsFromDatabase();
  return { students, source: 'mysql' };
}
