"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '../components/ui/Button';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa';

const RegistrationPage = () => {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    program: searchParams?.get('program') || '',
    tier: searchParams?.get('tier') || '',
  });
  const [zipLookupLoading, setZipLookupLoading] = useState(false);

  const lookupZipCode = async (zipCode: string) => {
    if (zipCode.length !== 5) return;
    
    setZipLookupLoading(true);
    try {
      // Using free Zippopotam.us API
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (response.ok) {
        const data = await response.json();
        const place = data.places[0];
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            city: place['place name'],
            state: place['state abbreviation'],
          },
        }));
      }
    } catch (error) {
      console.error('Zip code lookup failed:', error);
    } finally {
      setZipLookupLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });

      // Auto-lookup city/state when zip code is entered
      if (addressField === 'zipCode' && value.length === 5) {
        lookupZipCode(value);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          text: data.message,
        });
        // In development, log the magic link
        if (data.magicLink) {
          console.log('🔗 Magic Link:', data.magicLink);
        }
      } else {
        setSubmitMessage({
          type: 'error',
          text: data.error || 'Registration failed. Please try again.',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-deep-black">
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-white mb-4">
              Create Your Account
            </h1>
            <p className="text-xl text-light-grey">
              Join our community - no password needed, we'll send you a magic link
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-navy p-8 rounded-lg border-2 border-neon-cyan">
            
            {/* Success/Error Message */}
            {submitMessage && (
              <div
                className={`mb-6 p-4 rounded-lg border-2 ${
                  submitMessage.type === 'success'
                    ? 'bg-deep-black border-neon-cyan text-neon-cyan'
                    : 'bg-deep-black border-neon-pink text-neon-pink'
                }`}
              >
                <p className="font-bold">{submitMessage.text}</p>
                {submitMessage.type === 'success' && (
                  <p className="text-sm text-light-grey mt-2">
                    Check your email inbox (and spam folder) for the magic link.
                  </p>
                )}
              </div>
            )}

            {/* Personal Information */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <FaUser className="text-3xl text-neon-cyan mr-3" />
                <h2 className="text-3xl font-bold text-white">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-white font-bold mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-deep-black text-white border-2 border-light-grey focus:border-neon-cyan focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-white font-bold mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-deep-black text-white border-2 border-light-grey focus:border-neon-cyan focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="mt-6">
                <label className="flex items-center text-white font-bold mb-2">
                  <FaBirthdayCake className="text-neon-pink mr-2" />
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-deep-black text-white border-2 border-light-grey focus:border-neon-cyan focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <FaEnvelope className="text-3xl text-neon-pink mr-3" />
                <h2 className="text-3xl font-bold text-white">Contact Information</h2>
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-white font-bold mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-deep-black text-white border-2 border-light-grey focus:border-neon-cyan focus:outline-none transition-colors"
                  required
                  placeholder="you@example.com"
                />
                <p className="text-sm text-light-grey mt-2">
                  We'll send a magic link to this email for secure sign-in
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center text-white font-bold mb-2">
                  <FaPhone className="text-electric-blue mr-2" />
                  Cell Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-deep-black text-white border-2 border-light-grey focus:border-neon-cyan focus:outline-none transition-colors"
                  required
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <FaMapMarkerAlt className="text-3xl text-electric-blue mr-3" />
                <h2 className="text-3xl font-bold text-white">Address</h2>
              </div>

              {/* Street Address */}
              <div className="mb-6">
                <label className="block text-white font-bold mb-2">Street Address *</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-deep-black text-white border-2 border-light-grey focus:border-neon-cyan focus:outline-none transition-colors"
                  required
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Zip Code */}
                <div>
                  <label className="block text-white font-bold mb-2">Zip Code *</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-deep-black text-white border-2 border-light-grey focus:border-neon-cyan focus:outline-none transition-colors"
                    required
                    placeholder="12345"
                    maxLength={5}
                    pattern="\d{5}"
                  />
                  {zipLookupLoading && (
                    <p className="text-sm text-neon-cyan mt-1">Looking up location...</p>
                  )}
                </div>

                {/* City - Auto-populated */}
                <div className="md:col-span-1">
                  <label className="block text-white font-bold mb-2">City *</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    className="w-full px-4 py-3 rounded-lg bg-navy text-neon-cyan border-2 border-neon-cyan opacity-75 cursor-not-allowed"
                    required
                    readOnly
                    placeholder="Auto-filled from zip"
                  />
                </div>

                {/* State - Auto-populated */}
                <div>
                  <label className="block text-white font-bold mb-2">State *</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    className="w-full px-4 py-3 rounded-lg bg-navy text-neon-cyan border-2 border-neon-cyan opacity-75 cursor-not-allowed"
                    required
                    readOnly
                    placeholder="Auto"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>

            {/* Program Info (if coming from program page) */}
            {formData.program && (
              <div className="mb-8 bg-deep-black p-6 rounded-lg border-2 border-neon-purple">
                <h3 className="text-xl font-bold text-white mb-3">Registration For:</h3>
                <p className="text-neon-cyan text-lg font-semibold capitalize">
                  {formData.program.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                {formData.tier && (
                  <p className="text-light-grey">
                    Tier: <span className="text-white font-bold">{formData.tier}</span>
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-4">
              <Button 
                type="submit" 
                variant="primary" 
                size="lg"
                className="w-full md:w-auto"
                onClick={undefined}
              >
                {isSubmitting ? 'Creating Account...' : 'Send Magic Link to Email'}
              </Button>
              <p className="text-sm text-light-grey text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>

          </form>
        </div>
      </section>
    </main>
  );
};

export default RegistrationPage;
