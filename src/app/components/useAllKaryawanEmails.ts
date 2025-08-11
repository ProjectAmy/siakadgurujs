"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export interface KaryawanTableRow {
  id: number;
  nama_lengkap: string;
  nomor_whatsapp: string;
  unit_sekolah: string;
  tanggal_lahir: string; // ISO string from DB
  status_kepegawaian: string; // status dari database
}

export function useAllKaryawanTableData() {
  const [karyawan, setKaryawan] = useState<KaryawanTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchKaryawan() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("karyawan")
        .select("id, nama_lengkap, nomor_whatsapp, unit_sekolah, tanggal_lahir, status_kepegawaian");
      if (error) {
        setError(error.message);
        setKaryawan([]);
      } else {
        setKaryawan(data || []);
      }
      setLoading(false);
    }
    fetchKaryawan();
  }, []);

  return { karyawan, loading, error };
}
