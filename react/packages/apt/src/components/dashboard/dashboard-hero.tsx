'use client';

import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/solid';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import { Routes } from '@/config/routes';
import useAuth from '@/hooks/use-auth';

export default function DashboardHero() {
  const { user } = useAuth();
  const router = useRouter();
  const name = user?.name ?? [user?.user_metadata?.first_name ?? 'User', user?.user_metadata?.last_name ?? ''].join(' ');
  console.log({user})

  return (
    <div className="mt-8 flex items-center justify-between lg:mt-12 2xl:mt-16">
      <div>
        <Text tag="h3" className="text-xl">
          Hello, {name}
        </Text>
        <Text className="mt-2 text-sm text-gray lg:mt-3">{user?.email ?? ''}</Text>
      </div>
      <div>
        <Button
          size="xl"
          rounded="pill"
          className="!p-2 capitalize text-white sm:rounded-md sm:!px-8 sm:!py-[10px]"
          onClick={() => router.push(Routes.public.addListing)}
        >
          <PlusIcon className="h-auto w-5 sm:mr-3" />
          <span className="hidden sm:block">Add listing</span>
        </Button>
      </div>
    </div>
  );
}
