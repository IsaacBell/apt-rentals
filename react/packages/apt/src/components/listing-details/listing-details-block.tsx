'use client';

import { vendorData } from 'public/data/listing-details';
import { reviewsData } from 'public/data/reviews';
import SpecificationBlock from '@/components/listing-details/specification-block';
import BookingForm from '@/components/listing-details/booking-form/booking-form';
import CalenderBlock from '@/components/listing-details/calendar/calender-block';
import ListingDetailsHeroBlock from '@/components/listing-details/hero-block';
import DescriptionBlock from '@/components/listing-details/descripton-block';
import EquipmentBlock from '@/components/listing-details/equipment-block';
import LocationBlock from '@/components/listing-details/location-block';
import ReviewBlock from '@/components/listing-details/review-block';
import VendorBlock from '@/components/listing-details/vendor-block';
import ChatBlock from '@/components/listing-details/chat-block';
import { useModal } from '@/components/modals/context';
import Button from '@/components/ui/button';
import { Property } from '@/types';
import { useState } from 'react';
import { useDB } from '@/hooks/use-db';
import { useEffectOnce } from 'react-use';

interface ListingProps {
  property: Property | null;
}

export default function ListingDetails({ property }: ListingProps) {
  const { openModal } = useModal();
  const { updateProperty } = useDB();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedProperty, setEditedProperty] = useState<Property | null>(property);

  useEffectOnce(() => {
    if (!editedProperty && property) setEditedProperty(property);
  })

  const handleSave = async () => {
    if (editedProperty) {
      const success = await updateProperty(editedProperty);
      if (success) {
        setEditMode(false);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between gap-5 lg:gap-8 xl:gap-12 4xl:gap-16">
        <div className="w-full">
          <ListingDetailsHeroBlock 
            onEdit={() => setEditMode(!editMode)} 
            onCancelEdit={() => setEditMode(false)}
            editMode={editMode} 
            property={editedProperty ?? property} 
            onPropertyChange={(updatedProperty) => setEditedProperty(updatedProperty)}
            // editedProperty={editedProperty}
          />
          <DescriptionBlock 
            editMode={editMode} 
            description={editedProperty?.description ?? property?.description ?? ''}
            onDescriptionChange={(value) =>
              setEditedProperty({ ...editedProperty, description: value } as Property)
            }
          />
          <LocationBlock 
            editMode={editMode} 
            address={editedProperty?.address ?? property?.address ?? ''} 
            onChange={val => setEditedProperty({ ...editedProperty, address: val } as Property)} 
          />
          <CalenderBlock 
            editMode={editMode} 
            address={editedProperty?.address ?? property?.address ?? ''} 
          />
          <ReviewBlock reviewsData={reviewsData} />
          <ChatBlock />
        </div>
        <div className="hidden w-full max-w-sm pb-11 lg:block xl:max-w-md 3xl:max-w-lg">
          <div className="sticky top-32 4xl:top-40">
            <BookingForm
              price={property?.price ?? 0}
              averageRating={reviewsData.stats.averageRating}
              totalReviews={reviewsData.stats.totalReviews}
            />
            <div className="mt-4 w-full text-center 4xl:mt-8">
              <Button
                size="lg"
                variant="text"
                className="relative !p-0 !font-bold !text-secondary focus:!ring-0"
                onClick={() => openModal('REPORT_LISTING')}
              >
                Report this listing
                <span className="absolute bottom-0 left-0 w-full border border-gray"></span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
