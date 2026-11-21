import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import RenderMetricsBanner from '@/components/RenderMetricsBanner';
import StudentTable from '@/components/StudentTable';
import { getStudentsData } from '@/lib/api';

// Enforce SSR: Dynamic server-side rendering on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  searchParams?: Promise<{ token?: string }>;
}

export default async function StudentsSSRPage({ searchParams }: Props) {
  const startTime = Date.now();

  const queryParams = searchParams ? await searchParams : {};

  // Read auth token from incoming request cookies or query parameters
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value || queryParams?.token;

  // Protect route: require valid login token
  if (!token) {
    redirect('/login');
  }

  // Fetch students: invokes API with JWT token (which queries MySQL) or direct MySQL fallback
  const { students, source } = await getStudentsData(token);
  const durationMs = Date.now() - startTime;
  const renderedAt = new Date().toISOString().replace('T', ' ').slice(0, 23);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RenderMetricsBanner
          strategy="SSR"
          renderedAt={renderedAt}
          durationMs={durationMs}
          source={source}
          totalStudents={students.length}
        />

        <StudentTable students={students} />
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        NEUST College of Information and Communications Technology • IPT02 Student Directory
      </footer>
    </div>
  );
}
