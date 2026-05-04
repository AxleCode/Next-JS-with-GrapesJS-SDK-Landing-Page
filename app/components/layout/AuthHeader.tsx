'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AuthHeader() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{user.name}</span>
        </Link>
      ) : (
        <>
          <Link href="/login" className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors">Login</Link>
          <Link href="/register" className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 border border-red-600 shadow-sm transition-all">
            Subscribe Rp100.000
          </Link>
        </>
      )}
    </div>
  );
}
