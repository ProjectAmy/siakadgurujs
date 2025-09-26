"use client";

import { useEffect, useState } from 'react';
import { useKaryawanProfile } from '@/app/components/useKaryawanProfile';
import { supabase } from '../../../../utils/supabaseClient';
import Link from 'next/link';

interface Feedback {
  id: string;
  title: string;
  description: string;
  jenis: 'saran' | 'kritik';
  ditujukan: string;
  created_at: string;
  email_address: string;
}

export default function FeedbackDetailPage({ params }: { params: { id: string } }) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useKaryawanProfile();

  useEffect(() => {
    const fetchFeedback = async () => {
      if (!profile?.email_address) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('id', params.id)
          .eq('email_address', profile.email_address)
          .single();
          
        if (error) throw error;
        
        setFeedback(data);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Gagal memuat detail feedback');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, [params.id, profile?.email_address]);

  const getJenisLabel = (jenis: string) => {
    return jenis === 'saran' ? 'Saran' : 'Kritik';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-gray-500">Memuat detail feedback...</p>
        </div>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-red-500">{error || 'Feedback tidak ditemukan'}</p>
          <Link 
            href="/dashboard/feedback" 
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Kembali ke Daftar Feedback
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link 
          href="/dashboard/feedback" 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          title="Kembali"
        >
          <span className="material-icons">arrow_back</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Detail Feedback</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{feedback.title}</h2>
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
            <span className="mr-4">
              {new Date(feedback.created_at).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </span>
            <span className="mr-4">{getJenisLabel(feedback.jenis)}</span>
            <span>Untuk: {feedback.ditujukan}</span>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Deskripsi:</h3>
            <p className="text-gray-800 whitespace-pre-line">{feedback.description}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <Link 
            href="/dashboard/feedback" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
          >
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    </div>
  );
}
