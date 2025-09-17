"use client";

import { useState } from 'react';
import { useKaryawanProfile } from "../../components/useKaryawanProfile";
import { supabase } from '../../../utils/supabaseClient';

export default function ComplainPage() {
  const { profile, loading, error } = useKaryawanProfile();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success: boolean; message: string} | null>(null);

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
          <div className="pt-8 px-6 mb-8">
            <h1 className="text-2xl font-bold text-blue-900 mb-2">Formulir Komplain</h1>
            <p className="text-gray-600">Silakan sampaikan keluhan atau masukan Anda</p>
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
