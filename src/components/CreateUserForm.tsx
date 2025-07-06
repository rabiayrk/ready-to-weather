'use client';

import { useState } from 'react';

export default function CreateUserForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(`Success! User '${data.email}' created.`);
      setEmail('');
      setPassword('');
    } else {
      setMessage(`Error: ${data.message || 'Failed to create user.'}`);
    }
  };

  return (
    <div className="rounded-lg bg-gray-800/50 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-md border-gray-700 bg-gray-900 px-3 py-2 text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-md border-gray-700 bg-gray-900 px-3 py-2 text-white"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-md border-gray-700 bg-gray-900 px-3 py-2 text-white">
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 font-medium text-white hover:from-indigo-700 hover:to-purple-700">
          Create User
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-center">{message}</p>}
    </div>
  );
}