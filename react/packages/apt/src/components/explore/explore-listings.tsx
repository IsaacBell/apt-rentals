'use client';

import { useEffect, useState } from 'react';
import ListingCard from '@/components/ui/cards/listing';
import Button from '@/components/ui/button';
import { useDB } from '@/hooks/use-db';
import { Property } from '@/types';
import { useSearchParams } from 'next/navigation';

export default function ExploreListings() {
  const { searchProperties } = useDB();
  const searchParams = useSearchParams();

  const [list, setList] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (!searchParams) return;
    console.info({ searchParams });

    const params = Object.fromEntries(searchParams.entries());
    setIsLoading(true);
    searchProperties(params)
      .then((res) => setProperties(res))
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  function handleLoadMore() {
    setIsLoading(true);
    setTimeout(() => {
      setList((prevList) => prevList + 10);
      setIsLoading(false);
    }, 600);
  }

  return (
    <div>
      <div className="mt-1 grid grid-cols-1 gap-x-5 gap-y-8 xs:grid-cols-2 lg:grid-cols-3 3xl:gap-y-10 4xl:grid-cols-4">
        {isLoading && <p>Loading...</p>}
        {!properties.length && !isLoading && <p>No Properties Found</p>}
        {!isLoading && properties.slice(0, list).map((item, index) => (
          <ListingCard
            key={`explore-apt-${index}`}
            id={`explore-apt-${index}`}
            slides={item.preview_images ?? item.previewImages ?? []}
            time={item.createdAt}
            caption={item.description}
            title={item.title}
            slug={item.id}
            location={item.address}
            price={String(item.price)}
            ratingCount={'12'}
            rating={4.8}
          />
        ))}
      </div>
      {properties.length >= 50 && (
        <Button
          size="xl"
          type="button"
          isLoading={isLoading}
          onClick={() => handleLoadMore()}
          className="relative bottom-0 left-1/2 z-30 mx-auto mt-16 -translate-x-1/2 px-6 py-2.5 md:sticky md:bottom-10 md:text-base xl:relative xl:bottom-0"
        >
          Load more
        </Button>
      )}
    </div>
  );
}