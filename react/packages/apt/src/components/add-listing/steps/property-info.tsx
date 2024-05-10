'use client';

import { z } from 'zod';
import Image from 'next/image';
import { useAtom, useSetAtom } from 'jotai';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FieldHelperText from '@/components/ui/form-fields/field-helper-text';
import CreateListingFooter from '@/components/footer/create-listing-footer';
import { storeAtom, stepAtom } from '@/components/add-listing/add-listing';
import AdvancedRadio from '@/components/ui/form-fields/advanced-radiobox';
import Textarea from '@/components/ui/form-fields/textarea';
import SetPrice from '@/components/add-listing/set-price';
import Text from '@/components/ui/typography/text';
import Counter from '@/components/ui/counter';
import { apartmentTypes } from 'public/data/apartment-types';

const PropertySchema = z.object({
  title: z
    .string()
    .min(1, { message: 'This field is required!' })
    .max(24, { message: 'Reached your letter limit.' }),
  location: z.string().min(4, { message: 'This field is required!' }),
  price: z.number().min(300, { message: 'Minimum price 300!' }),
  description: z
    .string()
    .min(5, { message: 'This field is required!' })
    .max(450, { message: 'Reached your letter limit.' }),
  rooms: z.number().optional(),
  area: z.number().optional(),
});

type PropertySchemaType = z.infer<typeof PropertySchema>;

export default function PropertyInfo() {
  const setStep = useSetAtom(stepAtom);
  const [store, setStore] = useAtom(storeAtom);
  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<PropertySchemaType>({
    defaultValues: {
      title: store.title,
      location: store.location,
      price: store.price,
      description: store.description,
      rooms: store.rooms,
      area: store.area,
    },
    resolver: zodResolver(PropertySchema),
  });

  function handlePropertyDetails(data: any) {
    setStore({
      ...store,
      title: data.title,
      location: data.location,
      price: data.price,
      description: data.description,
      rooms: data.rooms,
      area: data.area,
    });
    console.log(data);
    setStep(3);
  }

  return (
    <div className="w-full md:w-[448px] xl:w-[648px]">
      <form
        noValidate
        onSubmit={handleSubmit((data) => handlePropertyDetails(data))}
      >
        <Textarea
          variant="outline"
          label="First, let's give your listing a title"
          labelClassName="!mb-4 !text-lg !font-medium md:!text-xl lg:!mb-6 2xl:!text-2xl"
          textareaClassName="h-[72px] lg:h-20 w-full resize-none lg:rounded-xl"
          maxLength={24}
          {...register('title')}
          error={errors.title?.message}
        />
        <p className="mt-1 text-sm font-normal lg:mt-2 lg:text-base">
          {watch('title')?.length ?? 0}
          /24
        </p>
        <Text
          tag="h3"
          className="mb-4 mt-12 text-lg !font-medium md:!text-xl lg:mb-6 2xl:!text-2xl"
        >
          What Address?
        </Text>
        <Textarea
          variant="outline"
          label="Location"
          labelClassName="!mb-4 !text-lg !font-medium md:!text-xl lg:!mb-6 2xl:!text-2xl"
          textareaClassName="h-[72px] lg:h-20 w-full resize-none lg:rounded-xl"
          maxLength={24}
          {...register('location')}
          error={errors.location?.message}
        />
        <FieldHelperText className="text-xs font-normal text-red">
          {errors.location?.message}
        </FieldHelperText>
        <Text
          tag="h3"
          className="mb-4 mt-12 text-lg !font-medium md:!text-xl lg:mb-6 2xl:!text-2xl"
        >
          Now, Set your price
        </Text>
        <Controller
          name="price"
          control={control}
          render={({ field: { onChange, value } }) => (
            <SetPrice value={value} countBy={100} onChange={onChange} />
          )}
        />
        <FieldHelperText className="text-xs font-normal text-red">
          {errors.price?.message}
        </FieldHelperText>
        <Textarea
          variant="outline"
          className="mt-12"
          label="Create your description"
          maxLength={450}
          labelClassName="!mb-4 !text-lg !font-medium md:!text-xl lg:!mb-6 2xl:!text-2xl"
          textareaClassName="h-[72px] lg:h-20 w-full resize-none lg:rounded-xl"
          {...register('description')}
          error={errors.description?.message}
        />
        <p className="mt-1 text-sm font-normal lg:mt-2 lg:text-base">
          {watch('description')?.length ?? 0}
          /450
        </p>
        <Text
          tag="h3"
          className="mb-4 mt-12 text-lg !font-medium md:!text-xl lg:mb-6 2xl:!text-2xl"
        >
          Share some basic details about your apartment
        </Text>
        <div className="grid grid-cols-1 gap-2 lg:gap-3">
          <Controller
            name="rooms"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="card-gradient flex items-center justify-between rounded-lg border border-gray-lighter p-6 lg:rounded-xl lg:p-8">
                <Text className="text-base !font-semibold">Rooms</Text>
                <Counter
                  count={value ? value : 0}
                  onCount={onChange}
                  countBy={1}
                  buttonClassName="rounded-lg !h-6 !w-6 !p-1 sm:!h-9 sm:!w-9"
                />
              </div>
            )}
          />
          <Controller
            name="area"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="card-gradient flex items-center justify-between rounded-lg border border-gray-lighter p-6 lg:rounded-xl lg:p-8">
                <Text className="text-base !font-semibold">Area (sq. ft.)</Text>
                <Counter
                  count={value ? value : 0}
                  onCount={onChange}
                  countBy={100}
                  buttonClassName="rounded-lg !h-6 !w-6 !p-1 sm:!h-9 sm:!w-9"
                />
              </div>
            )}
          />
        </div>
        <CreateListingFooter onBack={() => setStep(1)} />
      </form>
    </div>
  );
}