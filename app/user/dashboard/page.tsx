"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaCog } from 'react-icons/fa';
import Button from '../../components/ui/Button';

const UserDashboard = () => {
  const router = useRouter();
  
  // TODO: Get user data from session/auth
  const user = {
    firstName: 'User',
    lastName: 'Name',
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (response.ok) {
        // Redirect to home page after sign out
        router.push('/');
      } else {
        console.error('Sign out failed');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="flex-1 bg-deep-black flex flex-col">
      {/* Dashboard Header */}
      <header className="bg-navy border-b-2 border-neon-cyan py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Welcome Message with Sign Out */}
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-white">
              Welcome, {user.firstName}!
            </h1>
            <button
              onClick={handleSignOut}
              className="text-sm text-light-grey hover:text-neon-pink transition-colors underline"
            >
              Sign Out
            </button>
          </div>

          {/* Settings Icon */}
          <Button variant="outline" size="sm" href="/user/settings">
            <FaCog className="text-xl" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-navy p-8 rounded-lg border-2 border-neon-cyan text-center">
            <p className="text-2xl text-light-grey">
              Your dashboard content will appear here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
