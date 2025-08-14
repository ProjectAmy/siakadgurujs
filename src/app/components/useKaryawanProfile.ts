"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

interface EditableField {
  panggilan?: string;
  nama_singkat?: string;
}

type EditableFields = EditableField[];

export interface KaryawanProfile {
  nama_lengkap: string;
  title: string;
  keterangan: string;
  jabatan: string;
  jenis_kelamin: string;
  panggilan: string;
  nama_singkat: string;
  unit_sekolah: string;
  status_kepegawaian: string;
  jabatan_karyawan: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat_lengkap: string;
  nomor_ktp: string;
  nomor_kk: string;
  status_pernikahan: string;
  email_address: string;
  nomor_whatsapp: string;
  pendidikan_terakhir: string;
  almamater: string;
  bergabung: string;
  posisi: string;
  keluar: string;
  sebab: string;
  editable?: EditableFields;
}

export function useKaryawanProfile() {
  const [profile, setProfile] = useState<KaryawanProfile | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      // Ambil user saat ini dari Supabase Auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("User tidak ditemukan");
        setLoading(false);
        setRole(null);
        return;
      }
      // Ambil role dari user_metadata Supabase
      setRole(user.user_metadata?.role || null);
      // Query tabel karyawan dengan join ke tabel editable
      const { data, error } = await supabase
        .from("karyawan")
        .select(`
          *,
          editable (panggilan, nama_singkat)
        `)
        .eq("email_address", user.email)
        .single();
        
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

  // No debug effects needed

  return { profile, loading, error, role };
}
