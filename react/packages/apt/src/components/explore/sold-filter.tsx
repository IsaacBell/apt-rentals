'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useQueryParam } from '@/hooks/use-query-param';
import Switch from '@/components/ui/form-fields/switch';

export default function SoldFilter() {
  const searchParams = useSearchParams();
  const soldParam = searchParams?.get('sold');
  const [sold, setSold] = useState<boolean>(Boolean(soldParam));
  const { updateQueryparams } = useQueryParam();

  // updates query
  useEffect(() => {
    updateQueryparams('sold', sold);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sold]);

  // reset
  useEffect(() => {
    if (!soldParam) {
      setSold(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soldParam]);

  return (
    <Switch
      label="Sold"
      checked={sold}
      labelPlacement="left"
      onChange={() => setSold(!sold)}
      handlerClassName="w-full items-center justify-between"
      labelClassName="font-bold text-sm lg:text-base text-gray-dark"
      switchClassName="peer-focus/switch:!ring-offset-0 focus:!ring-0"
    />
  );
}
