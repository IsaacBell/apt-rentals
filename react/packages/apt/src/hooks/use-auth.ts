'use client';

import { useEffect, useState } from 'react';
import { createClient, User, Session } from '@supabase/supabase-js';
import { useDB } from './use-db';
import { SignUpType, UserType } from '@/types';

type AuthErr = Record<string, string>;

export default function useAuth() {
  const { supabase, initSupabase, saveUser } = useDB();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionErrs, setSessionErrs] = useState<AuthErr[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) initSupabase();
  }, [])

  useEffect(() => {
    if (!!sessionErrs.length) console.trace(`${sessionErrs.length} session errors:`, sessionErrs);
  }, [])

  useEffect(() => {
    const getUserFromStorage = () => {
      const storedUser = localStorage.getItem('user');
      const storedSession = localStorage.getItem('session');

      if (storedUser && storedSession) {
        console.log('retrieve cached user session')
        setUser(JSON.parse(storedUser));
        setSession(JSON.parse(storedSession));
        setIsAuthorized(true);
        setIsLoading(false);
      } else {
        fetchUserAndSession();
      }
    };

    const fetchUserAndSession = async () => {
      if (!supabase) return;

      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthorized(!!session);
      setUser(session?.user as UserType | null);
      setIsLoading(false);
      console.log('-----fetchUserAndSession-----------')

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, sessionData) => {
          setIsAuthorized(!!sessionData);
          setSession(sessionData);
          setUser(sessionData?.user as UserType | null);

          // Store user and session in localStorage
          if (sessionData?.user) {
            localStorage.setItem('user', JSON.stringify(sessionData.user));
            localStorage.setItem('session', JSON.stringify(sessionData));
          } else {
            localStorage.removeItem('user');
            localStorage.removeItem('session');
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    };

    getUserFromStorage();
  }, [supabase]);

  const getSession = async (): Promise<UserType | null> => {
    if (!supabase) return null;

    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthorized(!!session);
    setUser(session?.user as UserType | null);
    console.log('user', session?.user)
    return session?.user as UserType;
  };

  const register = async (userData: SignUpType, isRealtor: boolean): Promise<UserType | null> => {
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
            userType: isRealtor ? 'realtor' : 'user',
          }
        }
      }
    )

    const user = data.user as UserType ?? data.session?.user as UserType ?? null;
    console.info('registered user: ', user)
    console.info('registered user session: ', session)

    setSession(data.session);
    setUser(user);

    saveUser(user);

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
      return;
    }

    setUser(null);
    setSession(null);
    localStorage.removeItem('user')
    localStorage.removeItem('session')
  };

  return {
    user,
    session,
    register,
    authorize,
    unauthorize,
    isAuthorized,
    getSession,
    isLoading,
    initSupabase,
    isRealtor: user?.userType == 'realtor',
    currentUser: user,
  };
}