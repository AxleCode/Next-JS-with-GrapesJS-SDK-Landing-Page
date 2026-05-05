'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Decode JWT and check expiration
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  try {
    // JWT payload is the second part of the token
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    const currentTime = Date.now() / 1000;
    
    // If exp is not present, token doesn't expire
    if (!decoded.exp) return false;
    
    return decoded.exp < currentTime;
  } catch (e) {
    return true; // Invalid token, treat as expired
  }
};

export default function AuthHeader() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    // Check if token is expired
    if (storedToken && isTokenExpired(storedToken)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
      return;
    }
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
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
        <div className="flex items-center gap-2">
          <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{user.name}</span>
            {role && role !== 'user' && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                role === 'admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {role.toUpperCase()}
              </span>
            )}
          </Link>
          {(role === 'creator' || role === 'admin') && (
            <Link 
              href="/templates/manage" 
              className="px-3 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Templates
            </Link>
          )}
        </div>
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
