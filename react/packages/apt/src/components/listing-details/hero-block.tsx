'use client';

import { Property, VendorTypes } from '@/types';
import { Menu } from '@headlessui/react';
import { HeartIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { ShareIcon } from '@/components/icons/share-icon';
import { useModal } from '@/components/modals/context';
import Text from '@/components/ui/typography/text';
import Button from '@/components/ui/button';
import { StopIcon, WrenchIcon } from '@heroicons/react/24/solid';

interface ListingDetailsHeroBlockProps {
  editButton?: JSX.Element;
  onEdit?: () => void;
  onCancelEdit?: () => void;
  editMode: boolean;
  vendor?: VendorTypes;
  property?: Property | null;
  editedProperty?: Property | null;
  onPropertyChange?: (p: Property) => void;
}

interface ShareIconsProps extends ListingDetailsHeroBlockProps {}

function ShareIcons(props: ShareIconsProps) {
  const { openModal } = useModal();
  return (
    <div className="mt-1 hidden items-center gap-3 bg-white md:flex 3xl:gap-6">
      <Button
        className="!border-none !bg-gray-lightest !p-4 text-gray-dark hover:!bg-gray-dark hover:text-white"
        size="sm"
        variant="outline"
        rounded="pill"
        onClick={() => openModal('SHARE')}
      >
        <ShareIcon className="h-auto w-5" />
      </Button>
      <Button
        className="!border-none !bg-gray-lightest !p-4 text-gray-dark hover:!bg-gray-dark hover:text-white"
        size="sm"
        variant="outline"
        rounded="pill"
      >
        <HeartIcon className="h-auto w-5" />
      </Button>
      <Button
        className="!border-none !bg-gray-lightest !p-4 text-gray-dark hover:!bg-gray-dark hover:text-white"
        size="sm"
        variant="outline"
        rounded="pill"
      >
        {!props.editMode && <WrenchIcon className="h-auto w-5" onClick={(e) => props.onEdit && props.onEdit()} />}
        {props.editMode && <StopIcon className="h-auto w-5" onClick={(e) => props.onCancelEdit && props.onCancelEdit()} />}
      </Button>
    </div>
  );
}

interface ShareMenuProps {}

function ShareMenu({}: ShareMenuProps) {
  const { openModal } = useModal();
  return (
    <Menu as="div" className="relative md:hidden">
      <div>
        <Menu.Button className="h-6 w-6 rounded-full border-none outline-none hover:ring-2 hover:ring-gray-lighter">
          <EllipsisHorizontalIcon className="h-6 w-6" />
        </Menu.Button>
        <Menu.Items className="absolute right-0">
          <div className="flex w-[150px] flex-col rounded-lg bg-white py-1 shadow-card">
            <Menu.Item>
              <button
                onClick={() => openModal('SHARE')}
                className="border-gray-lightest py-2 text-base font-medium text-gray-dark hover:bg-gray-lightest"
              >
                Share Now
              </button>
            </Menu.Item>
            <Menu.Item>
              <button className="border-gray-lightest py-2 text-base font-medium text-gray-dark hover:bg-gray-lightest">
                Add to wishlist
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </div>
    </Menu>
  );
}

export  function _ListingDetailsHeroBlock({
  editMode,
  onEdit,
  onCancelEdit,
  property,
  editedProperty,
}: ListingDetailsHeroBlockProps) {
  return (
    <div className="flex justify-between border-b border-gray-lighter pb-6 md:pb-8 2xl:pb-10">
      <div>
        <p className="text-gray-dark">{property?.address ?? ''}</p>
        <Text
          tag="h2"
          className="mt-2 !text-2xl uppercase !leading-7 md:!text-[26px] md:!leading-10 2xl:!text-[28px] 4xl:!text-3xl"
        >
          {property?.title ?? ''}
        </Text>
        <div className="mt-3 flex items-center gap-2 leading-4 text-gray-dark md:mt-4">
          <p>${property?.price ?? 0}/month</p>
          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-gray-dark"></span>
          <p>{property?.area ?? 0} sq ft.</p>
          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-gray-dark"></span>
          <p>{property?.rooms ?? 1} room{(property?.rooms ?? 0) > 1 ? 's' : ''}</p>
        </div>
      </div>
      <div className="relative">
        <ShareMenu />
        <ShareIcons onEdit={onEdit} onCancelEdit={onCancelEdit} editMode={editMode} />
      </div>
    </div>
  );
}

export default function ListingDetailsHeroBlock({
  editMode,
  onEdit,
  onCancelEdit,
  property,
  onPropertyChange,
  editedProperty,
}: ListingDetailsHeroBlockProps) {
  console.log({property, editedProperty})
  return (
    <div className="flex justify-between border-b border-gray-lighter pb-6 md:pb-8 2xl:pb-10">
      <div>
        {editMode && property ? (
          <input
            type="text"
            value={property?.address ?? ''}
            onChange={(e) => onPropertyChange && onPropertyChange({ ...property!, address: e.target.value })}
            className="text-gray-dark"
          />
        ) : (
          <p className="text-gray-dark">{property?.address ?? ''}</p>
        )}
        {editMode && property ? (
          <input
            type="text"
            value={property?.title ?? ''}
            onChange={(e) => onPropertyChange && onPropertyChange({ ...property!, title: e.target.value })}
            className="mt-2 !text-2xl uppercase !leading-7 md:!text-[26px] md:!leading-10 2xl:!text-[28px] 4xl:!text-3xl"
          />
        ) : (
          <Text
            tag="h2"
            className="mt-2 !text-2xl uppercase !leading-7 md:!text-[26px] md:!leading-10 2xl:!text-[28px] 4xl:!text-3xl"
          >
            {property?.title ?? ''}
          </Text>
        )}
        <div className="mt-3 flex items-center gap-2 leading-4 text-gray-dark md:mt-4">
          {editMode && property ? (
            <>
              <input
                type="number"
                value={property?.price ?? 0}
                onChange={(e) => onPropertyChange && onPropertyChange({ ...property!, price: Number(e.target.value || '0') })}
                className="w-24"
              />
              <span>/month</span>
            </>
          ) : (
            <p>${property?.price ?? 0}/month</p>
          )}
          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-gray-dark"></span>
          {editMode && property ? (
            <>
              <input
                type="number"
                value={property?.area ?? 0}
                onChange={(e) => onPropertyChange && onPropertyChange({ ...property!, area: Number(e.target.value ?? '0') })}
                className="w-24"
              />
              <span>sq ft.</span>
            </>
          ) : (
            <p>{property?.area ?? 0} sq ft.</p>
          )}
          <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-gray-dark"></span>
          {editMode && property ? (
            <>
              <input
                type="number"
                value={property?.rooms ?? 1}
                onChange={(e) => onPropertyChange && onPropertyChange({ ...property!, rooms: Number(e.target.value) })}
                className="w-16"
              />
              <span>room{property?.rooms && property.rooms > 1 ? 's' : ''}</span>
            </>
          ) : (
            <p>{property?.rooms ?? 1} room{(property?.rooms ?? 0) > 1 ? 's' : ''}</p>
          )}
        </div>
      </div>
      <div className="relative">
        <ShareMenu />
        <ShareIcons onEdit={onEdit} onCancelEdit={onCancelEdit} editMode={editMode} />
      </div>
    </div>
  );
}