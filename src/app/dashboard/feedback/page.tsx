"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useKaryawanProfile } from "../../components/useKaryawanProfile";
import { supabase } from '../../../utils/supabaseClient';

interface Feedback {
  id: string;
  title: string;
  jenis: 'saran' | 'kritik';
  ditujukan: string;
  created_at: string;
  email_address: string;
}

export default function FeedbackPage() {
  const { profile, loading, error } = useKaryawanProfile();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jenis: 'saran' as const,
    ditujukan: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success: boolean; message: string} | null>(null);
  const [userFeedback, setUserFeedback] = useState<Feedback[]>([]);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);
  
  // Fetch user's feedback
  useEffect(() => {
    const fetchUserFeedback = async () => {
      if (!profile?.email_address) return;
      
      try {
        setIsLoadingFeedback(true);
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('email_address', profile.email_address)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setUserFeedback(data || []);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setSubmitStatus({
          success: false,
          message: 'Gagal memuat daftar feedback. Silakan muat ulang halaman.'
        });
      } finally {
        setIsLoadingFeedback(false);
      }
    };
    
    if (profile?.email_address) {
      fetchUserFeedback();
    }
  }, [profile?.email_address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.email_address) {
      setSubmitStatus({
        success: false,
        message: 'Anda harus login untuk mengirim feedback.'
      });
      return;
    }
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.ditujukan.trim()) {
      setSubmitStatus({
        success: false,
        message: 'Semua field harus diisi.'
      });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert([
          { 
            title: formData.title.trim(),
            description: formData.description.trim(),
            jenis: formData.jenis,
            ditujukan: formData.ditujukan.trim(),
            email_address: profile.email_address
          }
        ])
        .select();
        
      if (error) throw error;
      
      // Update local state with new feedback
      if (data && data[0]) {
        setUserFeedback(prev => [data[0], ...prev]);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        jenis: 'saran',
        ditujukan: ''
      });
      
      setSubmitStatus({
        success: true,
        message: 'Feedback Anda telah berhasil dikirim. Terima kasih atas masukan Anda!'
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus({
        success: false,
        message: 'Terjadi kesalahan saat mengirim feedback. Silakan coba lagi nanti.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getJenisLabel = (jenis: string) => {
    return jenis === 'saran' ? 'Saran' : 'Kritik';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Kritik dan Saran</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Kirim Feedback</h2>
        
        {submitStatus && (
          <div className={`mb-4 p-3 rounded-md ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {submitStatus.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="jenis" className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
              <select
                id="jenis"
                name="jenis"
                value={formData.jenis}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                required
              >
                <option value="saran">Saran</option>
                <option value="kritik">Kritik</option>
              </select>
            </div>
            <div>
              <label htmlFor="ditujukan" className="block text-sm font-medium text-gray-700 mb-1">Ditujukan Kepada</label>
              <input
                type="text"
                id="ditujukan"
                name="ditujukan"
                value={formData.ditujukan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500"
                placeholder="Contoh: Guru Matematika, Sekolah, dll"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500"
              placeholder="Masukkan judul feedback"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500"
              placeholder="Tuliskan kritik dan saran Anda di sini..."
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Feedback'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Feedback Saya</h2>
        
        {isLoadingFeedback ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Memuat data feedback...</p>
          </div>
        ) : userFeedback.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Anda belum mengirimkan feedback.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userFeedback.map((feedback) => (
              <div key={feedback.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <Link 
                      href={`/dashboard/feedback/${feedback.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {feedback.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {new Date(feedback.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                      <span className="mx-2">•</span>
                      <span>{getJenisLabel(feedback.jenis)}</span>
                      <span className="mx-2">•</span>
                      <span>Untuk: {feedback.ditujukan}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
