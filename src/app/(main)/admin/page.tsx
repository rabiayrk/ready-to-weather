'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CreateUserForm from '@/components/CreateUserForm';
import AllHistory from '@/components/AllHistory';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl p-4 text-white sm:p-8">
      <h1 className="mb-6 text-3xl font-bold">Admin Panel</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <AllHistory />
        <CreateUserForm />
      </div>
    </div>
  );
}