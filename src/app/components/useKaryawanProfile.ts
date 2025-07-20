"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export interface KaryawanProfile {
  nama_lengkap: string;
  title: string;
  keterangan: string;
  jabatan: string;
  jenis_kelamin: string;
}

export function useKaryawanProfile() {
  const [profile, setProfile] = useState<KaryawanProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      // Ambil user saat ini dari Supabase Auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
console.log('DEBUG: Supabase user:', user);
console.log('GOOGLE USER OBJECT:', user);
      if (userError || !user) {
        setError("User tidak ditemukan");
        setLoading(false);
        return;
      }
      // Query tabel karyawan dengan email user
      const { data, error } = await supabase
        .from("karyawan")
        .select("nama_lengkap, title, keterangan, jabatan, jenis_kelamin")
        .eq("email_address", user.email)
        .single();
      console.log('DEBUG: Query result:', JSON.stringify({ data, error, email: user?.email }, null, 2));
      if (error) {
        setError(error.message);
        setProfile(null);
      } else {
        setProfile(data as KaryawanProfile);
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    // Debug: track loading, user, and error state
    console.log('DEBUG TRACKER:', { loading, profile, error });
  }, [loading, profile, error]);

  return { profile, loading, error };
}
