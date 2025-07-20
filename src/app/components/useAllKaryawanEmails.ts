"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

export interface KaryawanEmail {
  email_address: string;
}

export function useAllKaryawanEmails() {
  const [emails, setEmails] = useState<KaryawanEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmails() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("karyawan")
        .select("email_address");
      if (error) {
        setError(error.message);
        setEmails([]);
      } else {
        setEmails(data || []);
      }
      setLoading(false);
    }
    fetchEmails();
  }, []);

  return { emails, loading, error };
}
