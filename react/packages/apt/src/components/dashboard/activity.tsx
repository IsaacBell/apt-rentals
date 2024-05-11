'use client';

import { reservationData } from 'public/data/orders';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { reservationColumn } from '@/components/reservation/reservation-col';
import Input from '@/components/ui/form-fields/input';
import Pagination from '@/components/ui/pagination';
import Text from '@/components/ui/typography/text';
import Table from '@/components/ui/table';
import { Property } from '@/types';
import useAuth from '@/hooks/use-auth';
import { useDB } from '@/hooks/use-db';
import { useRouter } from 'next/navigation';
import { Routes } from '@/config/routes';

export default function Activity() {
  const router = useRouter();
  const { getProperties, deleteProperty } = useDB();
  const { user } = useAuth();

  const [order, setOrder] = useState<string>('desc');
  const [column, setColumn] = useState<string>('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesFetched, setPropertiesFetched] = useState<boolean>(false);
  const [searchfilter, setSearchFilter] = useState('');
  const [current, setCurrent] = useState(1);
  const pageSize = 10;

  useEffect(() => {
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

  const onMore = useCallback((e: any, row: any) => {
    console.log('View', e.target.id);
    router.push(Routes.public.listingDetails(row.id ?? e.target.id));
  }, []);
  const onEdit = useCallback((e: any, row: any) => {
    console.log('Edit', e.target.id);
    router.push(Routes.public.listingDetails(row.id ?? e.target.id))
  }, []);
  const onDelete = useCallback((e: any, row: any) => {
    console.log(e.target.id);
    deleteProperty(row);
    setProperties(properties.filter(p => p.id === row.id));
  }, []);

  const columns = useMemo(
    () => [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Area',
        dataIndex: 'area',
        key: 'area',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: 'Rooms',
        dataIndex: 'rooms',
        key: 'rooms',
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (record: Property) => (
          <div className="flex items-center space-x-4">
            <button
              id="view"
              className="text-blue-500 hover:text-blue-600"
              onClick={(e) => onMore(e, record)}
            >
              View
            </button>
            <button
              id="edit"
              className="text-green-500 hover:text-green-600"
              onClick={(e) => onEdit(e, record)}
            >
              Edit
            </button>
            <button
              id="delete"
              className="text-red-500 hover:text-red-600"
              onClick={(e) => onDelete(e, record)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [onMore]
  );

  return (
    <>
      <div className="mb-4 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_262px] md:gap-5 xl:gap-10">
        <Text tag="h4" className="text-xl">
          Transaction Activity
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
          variant="solid"
          prevIconClassName="!text-gray-dark"
          nextIconClassName="!text-gray-dark"
          onChange={(page) => {
            setCurrent(page);
          }}
        />
      </div>
    </>
  );
}
