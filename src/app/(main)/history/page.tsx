'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface QueryHistory {
  id: number;
  city: string;
  temperature: number;
  unit: string;
  createdAt: string;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<QueryHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchHistory = async () => {
        try {
          const response = await fetch('/api/weather/history');
          if (!response.ok) {
            throw new Error('Failed to fetch history');
          }
          const data = await response.json();
          setHistory(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [status]);
  
  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/signin');
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl p-4 text-white sm:p-8">
      <h1 className="mb-6 text-2xl font-bold">My Search History</h1>
      {loading ? (
        <p>Loading history...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-gray-800/50 shadow-lg">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-700/50 text-xs uppercase text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">City</th>
                <th scope="col" className="px-6 py-3">Temperature</th>
                <th scope="col" className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b border-gray-700">
                  <td className="px-6 py-4 font-medium">{item.city}</td>
                  <td className="px-6 py-4">{Math.round(item.temperature)}° {item.unit.charAt(0)}</td>
                  <td className="px-6 py-4 text-gray-300">{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}