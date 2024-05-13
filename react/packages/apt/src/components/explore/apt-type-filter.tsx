'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQueryParam } from '@/hooks/use-query-param';
import SelectBox from '@/components/ui/select-box';
import { StarIcon, TagIcon, WifiIcon } from '@heroicons/react/24/solid';
import { HomeIcon } from '@heroicons/react/24/outline';

const options = [
  {
    label: 'Choose apt. type',
    icon: <TagIcon className="h-auto w-5" />,
    disabled: true,
  },
  {
    label: 'Top Rated',
    icon: <StarIcon className="h-auto w-5" />,
  },
  {
    label: 'Townhouse',
    icon: <HomeIcon className="h-auto w-5" />,
  },
  {
    label: 'WFH',
    icon: <WifiIcon className="h-auto w-5" />,
  },
];

export default function AptTypeFilter() {
  const searchParams = useSearchParams();
  const aptType = searchParams?.get('aptType');
  const { clearFilter, updateQueryparams } = useQueryParam();
  const [selected, setSelected] = useState(options[0]);

  // sets the url when selected
  useEffect(() => {
    if (selected.disabled) {
      clearFilter(['aptType']);
    } else {
      updateQueryparams('aptType', selected.label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // sets the state if in url
  useEffect(() => {
    if (aptType) {
      const b: any = options.find((item) => item.label === aptType);
      setSelected(b);
    } else {
      setSelected(options[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aptType]);

  return (
    <SelectBox
      value={selected}
      label="Select Apt. Type"
      options={options}
      optionIcon={true}
      onChange={(data: any) => setSelected(data)}
      labelClassName="mb-2 !text-sm lg:!text-base"
      buttonClassName="h-10 lg:h-11 2xl:h-12"
      arrowIconClassName="right-3"
      clearable={selected.disabled ? false : true}
      onClearClick={(e) => {
        e.stopPropagation();
        setSelected(options[0]);
      }}
    />
  );
}
