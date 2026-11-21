import Navbar from '@/components/Navbar';
import RenderMetricsBanner from '@/components/RenderMetricsBanner';
import StudentTable from '@/components/StudentTable';
import { getStudentsFromDatabase } from '@/lib/db';
import ClientAuthGuard from '@/components/ClientAuthGuard';

// Enforce ISR: Incremental Static Regeneration with 60s cache revalidation
export const revalidate = 60;

export default async function StudentsISRPage() {
  const startTime = Date.now();

  // For pure ISR, data is pre-rendered at build time or revalidated in background every 60s
  // directly from MySQL so no dynamic request cookies are required for page generation
  const students = await getStudentsFromDatabase();
  const durationMs = Date.now() - startTime;
  const renderedAt = new Date().toISOString().replace('T', ' ').slice(0, 23);

  return (
    <ClientAuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RenderMetricsBanner
            strategy="ISR"
            renderedAt={renderedAt}
            durationMs={durationMs}
            source="mysql"
            totalStudents={students.length}
          />

          <StudentTable students={students} />
        </main>

        <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
          NEUST College of Information and Communications Technology • IPT02 Student Directory
        </footer>
      </div>
    </ClientAuthGuard>
  );
}
