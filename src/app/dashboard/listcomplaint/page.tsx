"use client";

import { useEffect, useState } from 'react';
import { useKaryawanProfile } from "../../components/useKaryawanProfile";
import { supabase } from '../../../utils/supabaseClient';
import Link from 'next/link';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'submitted' | 'in review' | 'in progress' | 'resolved' | 'closed';
  created_at: string;
  email: string;
  user_name?: string;
}

export default function ListComplaint() {
  const { profile, loading, error } = useKaryawanProfile();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch complaints based on user role and status filter
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoadingComplaints(true);
        const isAdmin = profile?.role === 'admin';
        
        // For admin, fetch all complaints
        let query = supabase
          .from('complaint')
          .select('*')
          .order('created_at', { ascending: false });

        // For regular users, only fetch their own complaints
        if (!isAdmin && profile?.email_address) {
          query = query.eq('email', profile.email_address);
        }

        // Apply status filter if selected
        if (statusFilter) {
          query = query.eq('status', statusFilter);
        }

        const { data, error } = await query;

        if (error) throw error;

        // If admin, fetch user names for each complaint
        if (isAdmin && data) {
          const userIds = [...new Set(data.map(c => c.email))];
          const { data: userData } = await supabase
            .from('karyawan')
            .select('email_address, nama_lengkap')
            .in('email_address', userIds);

          const userMap = new Map(userData?.map(user => [user.email_address, user.nama_lengkap]));
          
          const complaintsWithUser = data.map(complaint => ({
            ...complaint,
            user_name: userMap.get(complaint.email) || 'Unknown User'
          }));

          setComplaints(complaintsWithUser);
        } else {
          setComplaints(data || []);
        }
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setErrorMessage('Gagal memuat data komplain. Silakan coba lagi.');
      } finally {
        setLoadingComplaints(false);
      }
    };

    if (profile) {
      fetchComplaints();
    }
  }, [profile, statusFilter]);

  // Get status badge style
  const getStatusBadge = (status: string) => {
    const baseStyle = 'px-2 py-1 text-xs font-semibold rounded-full';
    switch (status) {
      case 'submitted':
        return `${baseStyle} bg-blue-100 text-blue-800`;
      case 'in review':
        return `${baseStyle} bg-yellow-100 text-yellow-800`;
      case 'in progress':
        return `${baseStyle} bg-purple-100 text-purple-800`;
      case 'resolved':
        return `${baseStyle} bg-green-100 text-green-800`;
      case 'closed':
        return `${baseStyle} bg-gray-100 text-gray-800`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800`;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse">Memuat...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Gagal memuat profil pengguna'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">Daftar Komplain</h1>
        <p className="text-gray-600">
          {profile.role === 'admin' 
            ? 'Daftar semua komplain dari pengguna' 
            : 'Daftar komplain yang telah Anda ajukan'}
        </p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter(null)}
          className={`px-3 py-1 text-sm rounded-full ${
            !statusFilter 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Semua
        </button>
        {['submitted', 'in review', 'in progress', 'resolved', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 text-sm rounded-full ${
              statusFilter === status
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
        </div>
      )}

      {/* Loading State */}
      {loadingComplaints ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">Memuat data komplain...</div>
        </div>
      ) : (
        /* Complaints List */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {complaints.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    {profile.role === 'admin' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pengguna
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Judul
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {complaints.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(complaint.created_at)}
                      </td>
                      {profile.role === 'admin' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {complaint.user_name || complaint.email}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {complaint.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(complaint.status)}>
                          {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link 
                          href={`/dashboard/complaint/${complaint.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Lihat Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              Tidak ada komplain yang ditemukan.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
