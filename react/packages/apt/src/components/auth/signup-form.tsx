'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Routes } from '@/config/routes';
import Input from '@/components/ui/form-fields/input';
import Button from '@/components/ui/button';
import Checkbox from '@/components/ui/form-fields/checkbox';
import { SignUpType, signUpSchema } from '@/types';
import useAuth from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDB } from '@/hooks/use-db';
import { User } from '@supabase/supabase-js';

type UserTypeSelection = 'user' | 'realtor' | null;

export default function SignUpForm() {
  const router = useRouter();
  const [isRealtor, setIsRealtor] = useState<boolean>(false);
  const { register: supabaseRegisterUser } = useAuth();
  const { saveUser } = useDB();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
  });

  function handleFormSubmit(data: SignUpType) {
    if (isRealtor)
      data.userType = 'realtor';
    
    supabaseRegisterUser(data, isRealtor);
    saveUser(data as any)
    router.push(Routes.auth.signIn);
  }

  return (
    <form noValidate onSubmit={handleSubmit((d) => handleFormSubmit(d))}>
      <div className="flex items-center justify-between gap-3">
        <Input
          type="text"
          label="First name"
          className="mb-4"
          error={errors?.firstName?.message ?? undefined}
          required
          {...register('firstName')}
        />
        <Input
          type="text"
          label="Last name"
          className="mb-4"
          error={errors?.lastName?.message ?? undefined}
          {...register('lastName')}
        />
      </div>
      <Input
        type="text"
        label="Email"
        className="mb-4"
        error={errors?.email?.message ?? undefined}
        required
        {...register('email')}
      />
      <div className="flex items-center justify-between gap-3">
        <Input
          type="password"
          label="Password"
          className="mb-4"
          error={errors?.password?.message ?? undefined}
          required
          {...register('password')}
        />
        <Input
          type="password"
          label="Confirm password"
          className="mb-4"
          error={errors?.confirmPassword?.message ?? undefined}
          required
          {...register('confirmPassword')}
        />
        <Checkbox
          size="sm"
          label="Register me as a realtor"
          labelClassName="ml-2"
          inputClassName="!text-gray-dark"
          checked={isRealtor}
          onChange={() => {
            setIsRealtor(!isRealtor)
          }}
        />
      </div>
      <Checkbox
        label={
          <>
            <span className="font-normal">I’ve read and agree with </span>
            <Link href="/" className="underline">
              Terms of Service and our Privacy Policy.
            </Link>
          </>
        }
        size="sm"
        className="mb-7"
        labelClassName="ml-3"
        containerClassName="!items-start"
        inputClassName="!text-gray-dark"
        {...register('acceptPolicy')}
      />
      <Button type="submit" className="mb-2 w-full" size="xl">
        Sign Up
      </Button>
      <p className="text-sm leading-6 text-gray">
        Already have an account? &nbsp;
        <Link
          href={Routes.auth.signIn}
          className="font-semibold text-primary underline"
        >
          Sign In
        </Link>
      </p>
      <div className="relative mb-8 mt-7 text-center before:absolute before:left-0 before:top-1/2 before:h-[1px] before:w-full before:bg-gray-200">
        <span className="relative z-10 m-auto inline-flex bg-white px-5">
          Or
        </span>
      </div>
    </form>
  );
}
