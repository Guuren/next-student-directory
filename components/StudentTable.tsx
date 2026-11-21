'use client';

import { useState, useMemo } from 'react';
import { Student } from '@/types/student';
import {
  Search,
  Filter,
  Users,
  Layers,
  CheckCircle2,
  ExternalLink,
  Mail,
  Phone,
  UserCheck,
} from 'lucide-react';

interface Props {
  students: Student[];
}

export default function StudentTable({ students }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');

  // Compute sections
  const sections = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.section) set.add(s.section);
    });
    return Array.from(set).sort();
  }, [students]);

  // Compute filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        searchTerm === '' ||
        s.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.section?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSection =
        selectedSection === 'ALL' || s.section === selectedSection;

      return matchesSearch && matchesSection;
    });
  }, [students, searchTerm, selectedSection]);

  // Metric stats
  const totalStudents = students.length;
  const totalSections = sections.length;
  const withAvatars = students.filter(
    (s) => s.profile_picture_url && !s.profile_picture_url.includes('placeholder')
  ).length;
  const completionPercent =
    totalStudents > 0 ? Math.round((withAvatars / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Total Enrolled
              </p>
              <h3 className="text-3xl font-extrabold text-white mt-1">
                {totalStudents}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Active university students in database</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Class Sections
              </p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-1">
                {totalSections}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Distinct academic sections registered</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Profile Completion
              </p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">
                {completionPercent}%
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">{withAvatars} custom avatars uploaded</p>
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Table Controls Header */}
        <div className="p-5 border-b border-slate-800/80 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Student Roster
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredStudents.length} of {totalStudents} students
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, ID, section, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Section Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter Section:
            </span>
            <button
              onClick={() => setSelectedSection('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedSection === 'ALL'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Sections
            </button>
            {sections.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedSection === sec
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Student ID</th>
                <th className="px-5 py-3.5">Section</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5 text-right">Links</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const avatar =
                    student.profile_picture_url &&
                    student.profile_picture_url.trim() !== '' &&
                    !student.profile_picture_url.includes('placeholder')
                      ? student.profile_picture_url
                      : null;

                  return (
                    <tr
                      key={student.id || student.student_id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center space-x-3">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={student.student_name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-700"
                              onError={(e) => {
                                // Fallback if image fails to load
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-indigo-900/60 border border-indigo-700/50 flex items-center justify-center text-xs font-bold text-indigo-300 uppercase">
                              {student.student_name ? student.student_name.slice(0, 2) : 'ST'}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-white">
                              {student.student_name}
                            </div>
                            <div className="text-xs text-slate-400 sm:hidden font-mono">
                              {student.student_id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="px-5 py-3.5 font-mono font-medium text-amber-300 text-xs">
                        {student.student_id}
                      </td>

                      {/* Section */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {student.section || 'N/A'}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-3.5 text-xs space-y-0.5">
                        {student.email && (
                          <div className="flex items-center space-x-1.5 text-slate-300">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <a
                              href={`mailto:${student.email}`}
                              className="hover:text-indigo-400 transition-colors truncate max-w-[200px]"
                            >
                              {student.email}
                            </a>
                          </div>
                        )}
                        {student.mobile_number && (
                          <div className="flex items-center space-x-1.5 text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span>{student.mobile_number}</span>
                          </div>
                        )}
                      </td>

                      {/* Links */}
                      <td className="px-5 py-3.5 text-right">
                        {student.social_media_link ? (
                          <a
                            href={student.social_media_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          >
                            <span>Social</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500 text-sm">
                    No students match your search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
