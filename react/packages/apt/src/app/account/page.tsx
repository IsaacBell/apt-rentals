'use client';

import { dashboardCardData } from 'public/data/dashboard';
import Activity from '@/components/dashboard/activity';
import DashboardHero from '@/components/dashboard/dashboard-hero';
import StatCard from '@/components/ui/cards/stat-card';
import { useEffect, useState } from 'react';
import { useDB } from '@/hooks/use-db';
import useAuth from '@/hooks/use-auth';

export default function DashboardPage() {
  const { user } = useAuth();
  const { getUserStats } = useDB();
  const [stats, setStats] = useState<any>(null);
  const [statsFetched, setStatsFetched] = useState<boolean>(false);

  const cards = () => {
    const data = dashboardCardData;
    data[0].order = stats?.total_properties
    data[1].price = stats?.average_price
    data[2].price = stats?.total_price

    return data;
  }

  useEffect(() => {
    if (statsFetched || !user) return;

    getUserStats(user?.id).then((stats) => {
      setStats(stats);
      setStatsFetched(true);
    })
  }, [user])

  return (
    <div className="container-fluid mb-12 lg:mb-16">
      <DashboardHero />
      <div className="mb-12 mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:mb-16 lg:mt-12 2xl:mt-16 2xl:gap-6">
        {cards().map((item, index) => (
          <StatCard key={`pricing-card-${index}`} data={item} />
        ))}
      </div>

      <div>
        <Activity />
      </div>
    </div>
  );
}
