import { useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useEffectOnce } from 'react-use';
import useAuth from './use-auth';

export function useUploader() {
  const { user } = useAuth();
  const [loaded, setIsLoaded] = useState<boolean>(false);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffectOnce(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const client = createClient(supabaseUrl, supabaseAnonKey);
      setSupabase(client);
      setIsLoaded(true);
    }
  });

  const _upload = async (imageData: { id: string; img: string }[]): Promise<string[]> => {
    if (!loaded || !supabase) {
      throw new Error('Supabase client not initialized.');
    }

    const uploadedImages: string[] = [];

    for (const data of imageData) {
      try {
        const response = await fetch(data.img);
        const blob = await response.blob();
        const file = new File([blob], data.id, { type: blob.type });

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(data.id, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = await supabase.storage
          .from('images')
          .getPublicUrl(data.id);
        uploadedImages.push(publicUrlData.publicUrl);
      } catch (error) {
        console.error(`Error uploading image ${data.id}:`, error);
      }
    }

    return uploadedImages;
  };

  const upload = async (imageData: { id: string; img: string }[]): Promise<string[]> => {
    if (!loaded || !supabase) {
      throw new Error('Supabase client not initialized.');
    }
  
    const uploadedImages: string[] = [];
  
    for (const data of imageData) {
      try {
        const response = await fetch(data.img);
        const blob = await response.blob();
  
        // Extract the file name from the data.img URL
        const fileName = data.img.split('/').pop() || 'image';
  
        const file = new File([blob], fileName, { type: blob.type });
  
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(`public/${user?.id ?? 'anon-user'}-${fileName}`, file);
  
        if (uploadError) {
          throw uploadError;
        }
  
        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/public/${fileName}`;
        uploadedImages.push(publicUrl);
      } catch (error) {
        console.error(`Error uploading image ${data.id}:`, error);
      }
    }
  
    return uploadedImages;
  };

  return {
    upload,
  };
}