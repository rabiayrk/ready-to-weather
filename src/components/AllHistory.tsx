'use client';

import { useState, useEffect } from 'react';

interface AllHistoryItem {
  id: number;
  city: string;
  temperature: number;
  unit: string;
  createdAt: string;
  user: {
    email: string;
  };
}

export default function AllHistory() {
  const [history, setHistory] = useState<AllHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllHistory = async () => {
      try {
        const response = await fetch('/api/admin/weather/history');
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch all history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllHistory();
  }, []);

  return (
     <div className="rounded-lg bg-gray-800/50 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold">All User Queries</h2>
       {loading ? (
        <p>Loading history...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-700/50 text-xs uppercase text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">User</th>
                <th scope="col" className="px-6 py-3">City</th>
                <th scope="col" className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b border-gray-700">
                  <td className="px-6 py-4 font-medium">{item.user.email}</td>
                  <td className="px-6 py-4">{item.city}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}