'use client';

import { useEffect, useState } from 'react';
import useAuth from '@/hooks/use-auth';
import { Routes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/header/dashboard';
import MobileNav from '@/components/ui/mobile-nav';
import Footer from '@/components/footer/footer';
import { UserType } from '@/types';

export default function UserLayout({ children }: React.PropsWithChildren<{}>) {
  const router = useRouter();
  const { isAuthorized, currentUser, getSession, isLoading } = useAuth();
  const [user, setUser] = useState<UserType | null>(null);

  // Note: need this check if someone manually clear their cookie from browser
  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      console.log('user not authorized', currentUser);
      getSession().then((_user) => {
        if (_user) setUser(_user);
        console.log('currentUser', _user);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthorized]);


  return isLoading ? <div>Loading...</div> : (
    <>
      <DashboardHeader />
      <main className="flex-grow">{children}</main>
      <Footer className="hidden md:block" />
      <MobileNav />
    </>
  );
}
