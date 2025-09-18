"use client";

import { useEffect, useState } from 'react';
import { useKaryawanProfile } from '../../../components/useKaryawanProfile';
import { supabase } from '../../../../utils/supabaseClient';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

type StatusType = 'submitted' | 'in review' | 'in progress' | 'resolved' | 'closed';

interface Response {
  id: string;
  complaint_id: string;
  note: string;
  status: StatusType;
  created_at: string;
  updated_by: string;
  user_name?: string;
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'submitted' | 'in review' | 'in progress' | 'resolved' | 'closed';
  created_at: string;
  email: string;
  user_name?: string;
}

export default function ComplaintDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { profile, loading, error, role } = useKaryawanProfile();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loadingComplaint, setLoadingComplaint] = useState(true);
  const [loadingResponses, setLoadingResponses] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    note: '',
    status: '' as StatusType | ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fetch complaint data
  const fetchComplaint = async () => {
    const { data, error } = await supabase
      .from('complaint')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (data) setComplaint(data);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.note || !formData.status) {
      setErrorMessage('Harap isi semua field yang diperlukan');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get user profile
      const { data: karyawanData } = await supabase
        .from('karyawan')
        .select('nama_lengkap')
        .eq('email_address', user?.email)
        .single();

      const updatedBy = karyawanData?.nama_lengkap || user?.email || 'System';
      const closedBy = formData.status === 'closed' ? updatedBy : null;

      // Update complaint status
      const { error: updateError } = await supabase
        .from('complaint')
        .update({ 
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // Add to complaint_history
      const { error: historyError } = await supabase
        .from('complaint_history')
        .insert([{
          complaint_id: id,
          status: formData.status,
          note: formData.note,
          updated_by: updatedBy,
          closed_by: closedBy
        }]);

      if (historyError) throw historyError;

      // Refresh data
      await Promise.all([fetchResponses(), fetchComplaint()]);

      // Reset form
      setFormData({
        note: '',
        status: formData.status // Keep the current status
      });

    } catch (error) {
      console.error('Error submitting response:', error);
      setErrorMessage('Gagal mengirim tanggapan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch responses for this complaint from complaint_history
  const fetchResponses = async () => {
    try {
      setLoadingResponses(true);
      
      // Get all history entries for this complaint
      const { data: historyData, error } = await supabase
        .from('complaint_history')
        .select('*')
        .eq('complaint_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!historyData || historyData.length === 0) {
        setResponses([]);
        return;
      }

      // Get unique user emails from history
      const userEmails = [...new Set(historyData.map((h: any) => h.updated_by))];
      
      // Fetch user data in a single query
      const { data: usersData } = await supabase
        .from('karyawan')
        .select('email_address, nama_lengkap')
        .in('email_address', userEmails);

      // Create a map of email to user data
      const userMap = new Map(
        usersData?.map((user: any) => [user.email_address, user.nama_lengkap]) || []
      );

      // Format history data to match Response interface
      const formattedResponses = historyData.map((history: any) => ({
        id: history.id,
        complaint_id: history.complaint_id,
        status: history.status,
        note: history.note || `Status diubah menjadi: ${history.status}`,
        created_at: history.created_at,
        updated_by: history.updated_by,
        user_name: userMap.get(history.updated_by) || history.updated_by
      }));

      setResponses(formattedResponses);
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoadingResponses(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    const baseStyle = 'px-3 py-1 text-sm font-semibold rounded-full';
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

  // Fetch complaint details and responses
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoadingComplaint(true);
        
        // Fetch the complaint
        const { data: complaintData, error: complaintError } = await supabase
          .from('complaint')
          .select('*')
          .eq('id', id)
          .single();

        if (complaintError) throw complaintError;
        if (!complaintData) throw new Error('Komplain tidak ditemukan');

        // Set initial form status
        setFormData(prev => ({
          ...prev,
          status: complaintData.status
        }));

        // Fetch user name
        const { data: userData } = await supabase
          .from('karyawan')
          .select('nama_lengkap')
          .eq('email_address', complaintData.email)
          .single();

        setComplaint({
          ...complaintData,
          user_name: userData?.nama_lengkap || 'Pengguna Tidak Dikenal'
        });

        // Fetch responses
        await fetchResponses();
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Gagal memuat detail komplain. Pastikan ID komplain valid.');
      } finally {
        setLoadingComplaint(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading || loadingComplaint) {
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

  if (role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Akses Ditolak</h2>
          <p className="text-gray-600 mb-4">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          <Link 
            href="/dashboard" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-200"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Data komplain tidak ditemukan
        </div>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-200"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="pt-8 px-6">
          {loading ? (
            <span className="animate-pulse text-gray-400">Loading...</span>
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : !profile ? (
            <span className="text-red-500">Profil tidak ditemukan</span>
          ) : (
            <span className="text-xl md:text-2xl font-regular text-blue-900 text-center block">
              Ahlan Wa Sahlan,&nbsp;
              <span className="font-bold"> 
                {profile.editable?.[0]?.panggilan || profile.panggilan} {profile.editable?.[0]?.nama_singkat || profile.nama_singkat}
              </span>!
            </span>
          )}
        </div>
        <button
          onClick={() => router.back()}
          className="pt-8 flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Daftar Komplain
        </button>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Detail Komplain</h1>
          <span className={getStatusBadge(complaint.status)}>
            {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{complaint.title}</h2>
            <div className="text-sm text-gray-500 mb-4">
              <span>Oleh: {complaint.user_name || complaint.email}</span>
              <span className="mx-2">•</span>
              <span>Dibuat: {formatDate(complaint.created_at)}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Deskripsi</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">{complaint.description}</p>
            </div>
          </div>

          {/* Response Form */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tanggapi Komplain</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-black mb-1.5">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2.5 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  required
                >
                  <option value="" className="text-black">Pilih Status</option>
                  <option value="submitted" className="text-black">Submitted</option>
                  <option value="in review" className="text-black">In Review</option>
                  <option value="in progress" className="text-black">In Progress</option>
                  <option value="resolved" className="text-black">Resolved</option>
                  <option value="closed" className="text-black">Closed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="note" className="block text-sm font-semibold text-black mb-1.5">
                  Catatan <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="note"
                  name="note"
                  rows={4}
                  value={formData.note}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full text-sm text-black border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Tulis tanggapan Anda di sini..."
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Tanggapan'}
                </button>
              </div>
            </form>
          </div>

          {/* Responses List */}
          {responses.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Riwayat Tanggapan</h3>
              <div className="space-y-4">
                {responses.map((response) => (
                  <div key={response.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{response.user_name}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(response.created_at)}
                        </p>
                      </div>
                      <span className={getStatusBadge(response.status)}>
                        {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-2 text-gray-700 whitespace-pre-line">
                      {response.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
