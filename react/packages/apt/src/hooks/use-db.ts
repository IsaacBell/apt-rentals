import { UserType } from '@/types';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useDB() {
  const [supabase, setSupabaseClient] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    initSupabase();
  }, [])

  const initSupabase = async (): Promise<SupabaseClient> => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

    const client = await createClient(supabaseUrl, supabaseAnonKey)
    await setSupabaseClient(client);

    return client
  }
  
  const getUser = async (id: string): Promise<UserType | null> => {
    if (!supabase) return null
    const { data: users, error } = await supabase
      .from('users')
      .select("*")
      .neq('deleted', true)
      .eq('id', id)
    return (users ?? [])[0];
  }

  const getRealtor = async (id: string): Promise<UserType | null> => {
    if (!supabase) return null
    const { data: users, error } = await supabase
      .from('users')
      .select("*")
      .eq('id', id)
      .neq('deleted', true)
      .eq('user_type', 'realtor');
    return (users ?? [])[0];
  }

  return {
    initSupabase,
    getUser,
    getRealtor,
    supabase,
  };
}



  
          