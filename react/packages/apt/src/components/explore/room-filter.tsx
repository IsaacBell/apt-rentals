'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQueryParam } from '@/hooks/use-query-param';
import Text from '@/components/ui/typography/text';
import Counter from '@/components/ui/counter';

export default function RoomFilter() {
  const searchParams = useSearchParams();
  const r = searchParams?.get('rooms');
  const [rooms, setPeopleCount] = useState(Number(r) ?? 2);
  const { updateQueryparams } = useQueryParam();

  // sets the url params
  useEffect(() => {
    updateQueryparams('rooms', rooms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms]);

  // reset
  useEffect(() => {
    if (!r) {
      setPeopleCount(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r]);

  return (
    <div className="flex items-center justify-between py-2">
      <Text className="block !text-sm font-bold capitalize text-gray-dark lg:!text-base">
        No. rooms
      </Text>
      <Counter
        count={rooms}
        countBy={1}
        onCount={(val) => setPeopleCount(val)}
        buttonClassName="rounded-md !px-1 w-[30px]"
      />
    </div>
  );
}
