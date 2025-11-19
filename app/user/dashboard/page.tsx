"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCog, FaHandsHelping, FaFistRaised, FaYinYang, FaGraduationCap, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Button from '../../components/ui/Button';

// Available programs with metadata
const availablePrograms = [
  {
    id: 'spiritof',
    name: 'Spirit Of',
    description: 'Community impact and volunteer initiatives',
    icon: FaHandsHelping,
    color: 'electric-blue',
  },
  {
    id: 'fyht4',
    name: 'Fyht4',
    description: 'Advocacy and support program',
    icon: FaFistRaised,
    color: 'neon-pink',
  },
  {
    id: 'taekwondo',
    name: 'Taekwondo Academy',
    description: 'Martial arts training for all ages',
    icon: FaYinYang,
    color: 'neon-cyan',
  },
  {
    id: 'edynsgate',
    name: 'Edyns Gate',
    description: 'Online learning platform',
    icon: FaGraduationCap,
    color: 'neon-purple',
  },
  {
    id: 'homeschool',
    name: 'Homeschool',
    description: 'Homeschool education program',
    icon: FaGraduationCap,
    color: 'neon-cyan',
  },
];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [enrollmentRequired, setEnrollmentRequired] = useState(null);
  const [returnUrl, setReturnUrl] = useState(null);

  useEffect(() => {
    // Check for enrollment parameters
    const enrollParam = searchParams?.get('enroll');
    const returnToParam = searchParams?.get('returnTo');

    if (enrollParam) {
      setEnrollmentRequired(enrollParam);
      setReturnUrl(returnToParam);
    }

    fetchUserData();
  }, [searchParams]);

  const fetchUserData = async () => {
    try {
      // Check for valid JWT session from cookie
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (!data.success || !data.user) {
        setError('Please sign in to continue');
        return;
      }

      setUser(data.user);
      // Pre-select enrolled programs
      setSelectedPrograms(data.user.programs.map((p) => p.programId));
      
      // If enrollment required and not already enrolled, pre-select the program
      const enrollParam = searchParams?.get('enroll');
      if (enrollParam && !data.user.programs.some((p) => p.programId === enrollParam)) {
        setSelectedPrograms((prev) => [...prev, enrollParam]);
      }
    } catch (error) {
      console.error('Fetch user error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Sign out failed');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleProgramClick = (programId) => {
    // Check if already enrolled
    const isEnrolled = user?.programs.some((p) => p.programId === programId);
    
    if (isEnrolled) {
      // Already enrolled - could show program details or settings
      console.log('Already enrolled in:', programId);
      return;
    }

    // Not enrolled - start onboarding flow
    console.log('Starting onboarding for:', programId);
    // TODO: Navigate to program-specific onboarding
    // For now, just show a message
    setMessage(`Onboarding for ${programId} will begin here. Complete onboarding to access this program.`);
  };

  const handleStartOnboarding = (programId) => {
    // Navigate to program-specific onboarding page
    router.push(`/onboarding/${programId}?returnTo=${encodeURIComponent(returnUrl || '/user/dashboard')}`);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-deep-black flex items-center justify-center">
        <div className="text-2xl text-light-grey">Loading...</div>
      </div>
    );
  }

  const programToEnroll = enrollmentRequired
    ? availablePrograms.find((p) => p.id === enrollmentRequired)
    : null;

  return (
    <div className="flex-1 bg-deep-black flex flex-col">
      {/* Dashboard Header */}
      <header className="bg-navy border-b-2 border-neon-cyan py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Welcome Message with Sign Out */}
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-white">
              Welcome, {user?.firstName || 'User'}!
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

      {/* Enrollment Notice */}
      {enrollmentRequired && programToEnroll && (
        <div className="bg-electric-blue bg-opacity-20 border-b-2 border-electric-blue py-4 px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <FaExclamationCircle className="text-electric-blue text-2xl" />
            <div className="flex-1">
              <p className="text-white font-semibold">
                Onboarding Required: {programToEnroll.name}
              </p>
              <p className="text-light-grey text-sm">
                You need to complete onboarding for {programToEnroll.name} to access this program.
                Click "Start Onboarding" below to begin.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStartOnboarding(enrollmentRequired)}
            >
              Start Onboarding
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="flex-1 py-12 px-8">
        <div className="max-w-7xl mx-auto flex gap-8">
          {/* Sidebar - Program Selection */}
          <aside className="w-80 bg-navy p-6 rounded-lg border-2 border-neon-cyan h-fit">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-neon-cyan" />
              My Programs
            </h2>
            <p className="text-light-grey text-sm mb-6">
              Click on a program to start onboarding. Only after completing onboarding will you have access.
            </p>

            {/* Program Cards */}
            <div className="space-y-4 mb-6">
              {availablePrograms.map((program) => {
                const Icon = program.icon;
                const isEnrolled = user?.programs.some((p) => p.programId === program.id);
                const isRequired = enrollmentRequired === program.id;

                return (
                  <div
                    key={program.id}
                    onClick={() => !isEnrolled && handleProgramClick(program.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isRequired
                        ? 'border-electric-blue bg-electric-blue bg-opacity-20 animate-pulse cursor-pointer hover:bg-opacity-30'
                        : isEnrolled
                        ? `border-${program.color} bg-${program.color} bg-opacity-10`
                        : 'border-light-grey border-opacity-30 hover:border-light-grey cursor-pointer hover:bg-light-grey hover:bg-opacity-5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`text-2xl ${isEnrolled ? `text-${program.color}` : 'text-light-grey'}`} />
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{program.name}</h3>
                        <p className="text-light-grey text-xs mb-2">{program.description}</p>
                        
                        {isEnrolled ? (
                          <span className="inline-block text-xs text-neon-cyan font-semibold">
                            ✓ Enrolled
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartOnboarding(program.id);
                            }}
                            className="text-xs text-electric-blue hover:text-neon-cyan font-semibold underline"
                          >
                            Start Onboarding →
                          </button>
                        )}
                        
                        {isRequired && !isEnrolled && (
                          <span className="block mt-2 text-xs text-electric-blue font-semibold">
                            ⚠ Required for Access
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status Message */}
            {message && (
              <div
                className={`p-3 rounded-lg text-sm text-center ${
                  message.includes('Error')
                    ? 'bg-red-500 bg-opacity-20 text-red-300'
                    : 'bg-blue-500 bg-opacity-20 text-blue-300'
                }`}
              >
                {message}
              </div>
            )}
          </aside>

          {/* Main Dashboard Content */}
          <div className="flex-1">
            <div className="bg-navy p-8 rounded-lg border-2 border-neon-cyan">
              <h2 className="text-2xl font-bold text-white mb-4">Dashboard Overview</h2>
              <div className="space-y-4">
                <div className="p-4 bg-deep-black rounded-lg">
                  <h3 className="text-lg font-semibold text-neon-cyan mb-2">
                    Account Status: <span className="text-white">{user?.accountStatus || 'N/A'}</span>
                  </h3>
                  <p className="text-light-grey text-sm">
                    Email Verified: {user?.emailVerified ? '✓ Yes' : '✗ No'}
                  </p>
                  <p className="text-light-grey text-sm">
                    Profile Completeness: {user?.profileCompleteness || 0}%
                  </p>
                </div>

                <div className="p-4 bg-deep-black rounded-lg">
                  <h3 className="text-lg font-semibold text-neon-cyan mb-2">
                    Enrolled Programs ({user?.programs?.length || 0})
                  </h3>
                  {user?.programs && user.programs.length > 0 ? (
                    <ul className="space-y-2">
                      {user.programs.map((program) => {
                        const programInfo = availablePrograms.find((p) => p.id === program.programId);
                        return (
                          <li key={program.programId} className="text-light-grey text-sm flex items-center gap-2">
                            {programInfo && <programInfo.icon className={`text-${programInfo.color}`} />}
                            <span className="text-white font-medium">{programInfo?.name || program.programId}</span>
                            {program.tier && <span className="text-xs">({program.tier})</span>}
                            <span className={`text-xs ml-auto ${program.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                              {program.status}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-light-grey text-sm">No programs enrolled yet. Select programs from the sidebar.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <React.Suspense fallback={
      <div className="flex-1 bg-deep-black flex items-center justify-center">
        <div className="text-2xl text-light-grey">Loading...</div>
      </div>
    }>
      <DashboardContent />
    </React.Suspense>
  );
}
