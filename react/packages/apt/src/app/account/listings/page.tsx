'use client';

import { reservationData } from 'public/data/orders';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { reservationColumn } from '@/components/reservation/reservation-col';
import Input from '@/components/ui/form-fields/input';
import Pagination from '@/components/ui/pagination';
import Text from '@/components/ui/typography/text';
import Table from '@/components/ui/table';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useDB } from '@/hooks/use-db';
import useAuth from '@/hooks/use-auth';
import { Property } from '@/types';

export default function LIstingPage() {
  const { getProperties } = useDB();
  const { user } = useAuth();

  const [order, setOrder] = useState<string>('desc');
  const [column, setColumn] = useState<string>('');
  const [data, setData] = useState<typeof reservationData>([]);
  const [searchfilter, setSearchFilter] = useState('');
  const [current, setCurrent] = useState(1);
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesFetched, setPropertiesFetched] = useState<boolean>(false);

  const pageSize = 10;
  console.log({properties})

  useEffect(() => {
    console.log('here')
    if (!propertiesFetched && !!user)
      getProperties(user.id).then(propts => {
        setProperties(propts);
        setPropertiesFetched(true);
      })
  }, [user, getProperties, setProperties, propertiesFetched, setPropertiesFetched]);

  const filteredData = useMemo(() => {
    if (searchfilter) {
      return properties.filter((item) =>
        item.title.toLowerCase().includes(searchfilter.toLowerCase())
      );
    }
    return properties;
  }, [properties, searchfilter]);

  const paginatedData = useMemo(() => {
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [current, filteredData]);


  // single select checkbox function
  const onChange = useCallback(
    (row: any) => {
      let fArr = [...properties];
      let cArr: any = [];
      fArr.forEach((item) => {
        // if (item.id === row.id) item.checked = !item.checked;
        cArr.push(item);
      });
      setProperties(cArr);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [data],
  );

  // handle more button with edit, preview, delete
  const onMore = useCallback((e: any, row: any) => {
    console.log(e.target.id);
  }, []);

  // on header click sort table by ascending or descending order
  const onHeaderClick = useCallback(
    (value: string) => ({
      onClick: () => {
        setColumn(value);
        setOrder(order === 'desc' ? 'asc' : 'desc');
        if (order === 'desc') {
          //@ts-ignore
          setProperties([...data.sort((a, b) => (a[value] > b[value] ? -1 : 1))]);
        } else {
          //@ts-ignore
          setProperties([...data.sort((a, b) => (a[value] > b[value] ? 1 : -1))]);
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data],
  );

  const columns = useMemo(
    () => [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        onHeaderCell: () => onHeaderClick('title'),
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        onHeaderCell: () => onHeaderClick('address'),
      },
      {
        title: 'Area',
        dataIndex: 'area',
        key: 'area',
        onHeaderCell: () => onHeaderClick('area'),
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        onHeaderCell: () => onHeaderClick('price'),
      },
      {
        title: 'Rooms',
        dataIndex: 'rooms',
        key: 'rooms',
        onHeaderCell: () => onHeaderClick('rooms'),
      },
    ],
    [onHeaderClick]
  );

  return (
    <div className="container-fluid mb-12 lg:mb-16">
      <div className="mb-6 mt-8 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_262px] md:mt-10 md:gap-5 lg:mt-12 xl:mt-16 xl:gap-10">
        <Text tag="h4" className="text-xl">
          Your Listings
        </Text>
        <Input
          type="text"
          variant="outline"
          placeholder="Search by name"
          startIcon={<MagnifyingGlassIcon className="h-auto w-5" />}
          value={searchfilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          inputClassName="pl-12"
        />
      </div>
      <Table
        data={paginatedData}
        columns={columns}
        variant="minimal"
        className="text-sm"
      />
      <div className="mt-8 text-center">
        <Pagination
          current={current}
          total={paginatedData.length}
          pageSize={10}
          nextIcon="Next"
          prevIcon="Previous"
          prevIconClassName="!text-gray-dark"
          nextIconClassName="!text-gray-dark"
          onChange={(page) => {
            setCurrent(page);
          }}
        />
      </div>
    </div>
  );
}
