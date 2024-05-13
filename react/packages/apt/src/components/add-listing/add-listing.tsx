'use client';

import { atomWithStorage } from 'jotai/utils';
import { atom, useAtomValue } from 'jotai';
import dynamic from 'next/dynamic';
import { Assembly } from 'transloadit';
import { useDB } from '@/hooks/use-db';
import useAuth from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Routes } from '@/config/routes';

const CreateListing = dynamic(
  () => import('@/components/add-listing/steps/create-listing'),
);
const PropertyInfo = dynamic(
  () => import('@/components/add-listing/steps/property-info'),
);
const AddPhotos = dynamic(
  () => import('@/components/add-listing/steps/upload-photos'),
);
const AddLocation = dynamic(
  () => import('@/components/add-listing/steps/add-location'),
);
const AddEquipment = dynamic(
  () => import('@/components/add-listing/steps/add-equipment'),
);
const AddSpecification = dynamic(
  () => import('@/components/add-listing/steps/add-specification'),
);
const StepsEnd = dynamic(
  () => import('@/components/add-listing/steps/steps-end'),
);

export const stepAtom = atom(1);
export const storeAtom = atomWithStorage('addNewProperty', {
  title: '',
  description: '',
  area: 0,
  rooms: 0,
  price: 0,
  sold: false,
  deleted: false,
  location: '',
  userId: '',
  createdAt: null, // This will be set by the server
  updatedAt: null, // This will be set by the server
  images: [] as { id: string; img: string }[],
  uploadedImages: [] as string[],
  coordinates: [0.0,0.0],
  phoneNumber: '',
  address: '',
});

export default function AddListing() {
  const { user } = useAuth();
  const router = useRouter();

  const userType = user?.user_metadata?.userType ?? user?.userType ?? '';
  if (userType === 'user') router.push(Routes.public.explore);

  let stepComponent;
  const step = useAtomValue(stepAtom);
  switch (step) {
    case 1:
      stepComponent = <CreateListing />;
      break;
    case 2:
      stepComponent = <PropertyInfo />;
      break;
    case 3:
      stepComponent = <AddPhotos />;
      break;
    case 4:
      stepComponent = <AddLocation />;
      break;
    case 5:
      stepComponent = <StepsEnd />;
      break;
  }

  return (
    <div className="flex flex-grow items-center justify-center px-4 pb-24 pt-10">
      {stepComponent}
    </div>
  );
}
