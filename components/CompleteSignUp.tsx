'use client';

import { useState } from 'react';
import { FormInput } from './FormInput';
import { Button } from './Button';
import { auth } from '@/lib/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Account, NewAccount } from '@/schemas/account';
import { getAuthToken } from '@/lib/firebase/auth';
import { useRecoilState } from 'recoil';
import { accountState } from './ProtectedRoute';

interface SignupFormData {
  firstName: string;
  surname: string;
  dateOfBirth: string;
}

export default function CompleteSignUp() {
  const [user] = useAuthState(auth);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    surname: '',
    dateOfBirth: '',
  });
  const [, setAccount] = useRecoilState(accountState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !user) {
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error('Failed to fetch token');
      }

      const dateObject = new Date(formData.dateOfBirth);

      const body: NewAccount = {
        firstName: formData.firstName,
        surname: formData.surname,
        dob: {
          unix: Math.floor(dateObject.getTime()),
          timestamp: dateObject.toISOString(),
          day: dateObject.getUTCDate(),
          month: dateObject.getUTCMonth() + 1,
          year: dateObject.getUTCFullYear(),
        },
        plan: 'pro',
      };

      const res = await fetch('/api/accounts/me', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 201) {
        setError(true);
        setLoading(false);
        return;
      }

      const accountRes = await res.json();

      setLoading(false);
      setAccount({
        status: 'success',
        account: accountRes as Account,
      });
    } catch (error) {
      console.error(error);
      setError(true);
      setLoading(false);
    }
  };

  const timestampNow = +new Date();
  const selectedDateTimestamp = +new Date(formData.dateOfBirth);

  const isFormValid =
    formData.dateOfBirth &&
    formData.firstName &&
    formData.surname &&
    selectedDateTimestamp < timestampNow;

  return (
    <div className="h-screen overflow-auto flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-8 w-4/5 md:w-1/2 lg:w-1/4"
      >
        <h1 className="text-center text-2xl font-bold">Sign Up</h1>
        <div>
          <FormInput
            type="text"
            label="First Name"
            id="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                firstName: value,
              }))
            }
            required
          />
        </div>

        <div>
          <FormInput
            type="text"
            label="Surname"
            id="surname"
            placeholder="Doe"
            value={formData.surname}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                surname: value,
              }))
            }
            required
          />
        </div>

        <div>
          <FormInput
            type="date"
            label="Date of Birth"
            id="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                dateOfBirth: value,
              }))
            }
            required
          />
        </div>

        <Button
          type="submit"
          text="Start Tracking"
          className="w-full"
          disabled={!isFormValid}
          loading={loading}
        />
        {error && (
          <p className="text-primary text-center">
            Error creating account. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}
