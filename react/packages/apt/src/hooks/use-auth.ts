'use client';

import { useEffect, useState } from 'react';
import { createClient, User, Session } from '@supabase/supabase-js';
import { useDB } from './use-db';
import { SignUpType, UserType } from '@/types';



export default function useAuth() {
  const { supabase, initSupabase } = useDB();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!supabase) initSupabase();
  }, [])

  useEffect(() => {
    if (!supabase) return;

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthorized(!!session);
      setUser(session?.user as UserType | null);
      console.log('user', session?.user)
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthorized(!!session);
        setSession(session);
        setUser(session?.user as UserType | null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const register = async (userData: SignUpType): Promise<UserType | null> => {
    if (!supabase) {
      console.error('Supabase client not available for sign in');
      return null;
    }

    const { data, error } = await supabase.auth.signUp(
      {
        email: userData.email ?? '',
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            userType: userData.userType ?? 'user',
          }
        }
      }
    )

    const user = data.user as UserType ?? data.session?.user as UserType ?? null;
    console.info('registered user: ', user)
    console.info('registered user session: ', session)

    setSession(data.session);
    setUser(user);
    return user
  }

  const authorize = async (email: string, password: string): Promise<UserType | null> => {
    if (!supabase) {
      console.error('Supabase client not available for sign in');
      return null;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error.message);
    }

    console.info('signed in user:', data)
    setUser(data.user);
    setSession(data.session);

    return data.user as UserType
  };

  const unauthorize = async () => {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return {
    user,
    session,
    register,
    authorize,
    unauthorize,
    isAuthorized,
    isRealtor: user?.userType == 'realtor',
    currentUser: user,
  };
}