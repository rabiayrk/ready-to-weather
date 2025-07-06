'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gray-800/80 p-4 shadow-lg backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          WeatherApp
        </Link>
        <div className="flex items-center gap-4">
          {status === 'authenticated' ? (
            <>
              <Link href="/dashboard" className="text-gray-200 hover:text-white">
                Dashboard
              </Link>
              <Link href="/history" className="text-gray-200 hover:text-white">
                History
              </Link>
              {session.user?.role === 'ADMIN' && (
                <Link href="/admin" className="text-yellow-400 hover:text-yellow-300">
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="rounded-md bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-700">
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/signin" className="text-gray-200 hover:text-white">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}