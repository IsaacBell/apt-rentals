'use client'

import { vendorData } from 'public/data/listing-details';
import RelatedListingBlock from '@/components/listing-details/related-listings/related-listings-block';
import ListingDetails from '@/components/listing-details/listing-details-block';
import SubscriptionBlock from '@/components/subscription/subscription-block';
import GallaryBlock from '@/components/listing-details/gallary-block';
import { useDB } from '@/hooks/use-db';
import { useEffect, useState } from 'react';
import { Property } from '@/types';

export default function ListingDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { getProperty } = useDB();
  const [property, setProperty] = useState<Property | null>(null);
  const [propertyLoaded, setPropertyLoaded] = useState<boolean>(false);
  useEffect(() => {
    if (propertyLoaded) return;
    getProperty(slug).then((p: Property) => {
      setProperty(p);
      setPropertyLoaded(true);
    });
  }, [])

  return (
    <>
      <div className="container-fluid w-full 3xl:!px-12">
        <GallaryBlock images={vendorData.gallary} />
        <ListingDetails property={property} />
      </div>
      {/* <SubscriptionBlock sectionClassName="3xl:!px-12 4xl:!px-12" /> */}
    </>
  );
}
