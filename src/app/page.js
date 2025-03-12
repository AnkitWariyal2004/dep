'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({ mobileNumber: '', password: '' });

  // Redirect if user is already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard'); // Prevent going back to login
    }
  }, [status, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false, // Prevent automatic redirect
      mobileNumber: formData.mobileNumber,
      password: formData.password,
    });

    if (result?.error) {
      alert(result.error);
    } else {
      router.refresh('/dashboard'); // Redirect to dashboard after login
      alert('Login successful');
    }
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mobile Number Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="Enter your mobile number"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Login Button */}
          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-gray-600 mt-4">
          Don&apos;t have an account?
          <span className="text-blue-500 hover:underline cursor-pointer ml-1" onClick={() => router.push('/signup')}>
            Signup here
          </span>
        </p>
      </div>
    </div>
  );
}
