"use client";

import { useState, useEffect } from 'react';
import { useKaryawanProfile } from "../../components/useKaryawanProfile";
import { supabase } from '../../../utils/supabaseClient';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'submitted' | 'in review' | 'in progress' | 'resolved' | 'closed';
  created_at: string;
  email: string;
}

export default function ComplaintPage() {
  const { profile, loading, error } = useKaryawanProfile();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success: boolean; message: string} | null>(null);
  const [userComplaints, setUserComplaints] = useState<Complaint[]>([]);
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(true);
  
  // Fetch user's complaints
  useEffect(() => {
    const fetchUserComplaints = async () => {
      if (!profile?.email_address) return;
      
      try {
        setIsLoadingComplaints(true);
        const { data, error } = await supabase
          .from('complaint')
          .select('*')
          .eq('email', profile.email_address)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setUserComplaints(data || []);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setSubmitStatus({
          success: false,
          message: 'Gagal memuat daftar komplain. Silakan muat ulang halaman.'
        });
      } finally {
        setIsLoadingComplaints(false);
      }
    };
    
    fetchUserComplaints();
  }, [profile?.email_address]);
  
  // View complaint details
  const viewComplaintDetails = (complaint: Complaint) => {
    // You can implement a modal or redirect to a detailed view
    alert(`Detail Komplain:\nJudul: ${complaint.title}\nStatus: ${complaint.status}\n\n${complaint.description}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setSubmitStatus({
        success: false,
        message: 'Judul dan deskripsi harus diisi!'
      });
      return;
    }

    if (!profile) {
      setSubmitStatus({
        success: false,
        message: 'Tidak dapat mengidentifikasi pengguna. Silakan muat ulang halaman.'
      });
      return;
    }

    // Check if Supabase is properly initialized
    if (!supabase) {
      console.error('Supabase client is not initialized');
      setSubmitStatus({
        success: false,
        message: 'Kesalahan konfigurasi sistem. Silakan hubungi administrator.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      console.log('Submitting complaint with data:', {
        email: profile.email_address,
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: 'submitted'
      });

      const { data, error } = await supabase
        .from('complaint')
        .insert([
          { 
            email: profile.email_address, 
            title: formData.title.trim(), 
            description: formData.description.trim(),
            status: 'submitted',
            created_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('Complaint submitted successfully:', data);
      
      // Reset form on success
      setFormData({ title: '', description: '' });
      setSubmitStatus({
        success: true,
        message: 'Komplain berhasil dikirim! Kami akan menindaklanjuti keluhan Anda segera.'
      });
    } catch (error: any) {
      console.error('Error submitting complaint:', error);
      
      let errorMessage = 'Terjadi kesalahan saat mengirim komplain. Silakan coba lagi nanti.';
      
      // Handle specific error cases
      if (error.code === '23505') {
        errorMessage = 'Anda sudah mengirim komplain dengan judul yang sama. Mohon gunakan judul yang berbeda.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      setSubmitStatus({
        success: false,
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl min-h-screen flex flex-col bg-white">
      <div className="w-full">
        <div className="max-w-3xl mx-auto">
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

          {/* User's Previous Complaints */}
          <div className="mb-8 pt-8">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">Daftar Komplain Saya</h2>
              
              {isLoadingComplaints ? (
                <div className="animate-pulse">Memuat data komplain...</div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Judul
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userComplaints.length > 0 ? (
                        userComplaints.map((complaint) => (
                          <tr key={complaint.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(complaint.created_at).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {complaint.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                complaint.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                complaint.status === 'in review' ? 'bg-yellow-100 text-yellow-800' :
                                complaint.status === 'in progress' ? 'bg-purple-100 text-purple-800' :
                                complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {complaint.status === 'submitted' ? 'Submitted' :
                                 complaint.status === 'in review' ? 'In Review' :
                                 complaint.status === 'in progress' ? 'In Progress' :
                                 complaint.status === 'resolved' ? 'Resolved' : 'Closed'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button 
                                onClick={() => viewComplaintDetails(complaint)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Lihat
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                            Belum ada komplain yang diajukan
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          
          <div className="pt-2 px-6 mb-6">
            <h1 className="text-2xl font-bold text-blue-900 mb-2">Formulir Komplain</h1>
            <p className="text-gray-600 mb-6">Sampaikan keluhan Anda!</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            {submitStatus && (
              <div className={`mb-6 p-4 rounded ${submitStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Komplain <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md placeholder-gray-400 transition-colors"
                  placeholder="Masukkan judul komplain"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md placeholder-gray-400 transition-colors"
                  placeholder="Jelaskan komplain Anda secara detail..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-md text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Komplain'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
