"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation';
import { FaHandsHelping, FaCheckCircle, FaLock } from 'react-icons/fa';
import Button from '../../components/ui/Button.jsx';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function OnboardingForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [validatingPayment, setValidatingPayment] = useState(false);
  
  const programId = params.programId;
  const returnUrl = searchParams?.get('returnTo');
  
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);

  // Multi-Program Onboarding Form State
  const [formData, setFormData] = useState({
    // Payment Method (shared)
    paymentMethod: {
      name: '',
    },
    // Billing Address (shared)
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    // SpiritOf-specific fields
    children: [
      {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        grade: '',
        weeklyBudget: 0,
      }
    ],
    autoBill: {
      enabled: false,
      amount: '',
      frequency: 'monthly',
    },
    // EdynsGate-specific fields
    students: [
      {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        grade: '',
        learningLevel: 'beginner',
        subjects: [],
        learningGoals: '',
      }
    ],
    subscription: {
      tier: 'basic',
      frequency: 'monthly',
      amount: 0,
      autoCharge: true,
    },
    preferences: {
      emailNotifications: true,
      weeklyReports: true,
      learningReminders: true,
    },
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check for valid JWT session from cookie
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.success && data.user) {
          setUser(data.user);
          // Pre-fill billing address from user profile
          setFormData(prev => ({
            ...prev,
            billingAddress: {
              street: data.user.address?.street || '',
              city: data.user.address?.city || '',
              state: data.user.address?.state || '',
              zipCode: data.user.address?.zipCode || '',
            }
          }));
        } else {
          setError('Please sign in to continue');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setError('Failed to load user data. Please sign in again.');
      }
    };
    fetchUser();
  }, []);
  
  // Get user email from localStorage
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('vcorp_user_email') : null;

  // Program-specific onboarding steps
  const programSteps = {
    spiritof: [
      'Read and accept community guidelines',
      'Complete volunteer interest survey',
      'Review upcoming events',
      'Set your availability preferences'
    ],
    fyht4: [
      'Complete intake questionnaire',
      'Review support resources',
      'Schedule initial consultation',
      'Join support community'
    ],
    taekwondo: [
      'Complete health questionnaire',
      'Select class schedule',
      'Review safety guidelines',
      'Order uniform and equipment'
    ],
    edynsgate: [
      'Select learning path',
      'Complete skill assessment',
      'Set learning goals',
      'Explore course catalog'
    ],
    homeschool: [
      'Submit student information',
      'Select curriculum',
      'Schedule orientation',
      'Review homeschool requirements'
    ]
  };

  const steps = programSteps[programId as keyof typeof programSteps] || [];

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        grade: '',
        weeklyBudget: 0,
      }]
    }));
  };

  const removeChild = (index) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
  };

  const updateChild = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.map((child, i) => 
        i === index ? { ...child, [field]: value } : child
      )
    }));
  };

  const calculateTotalMagicPoints = (amount) => {
    // $1 = 100 magic points
    return amount * 100;
  };

  const handleSavePaymentMethod = async () => {
    if (!user) {
      setError('User not loaded. Please refresh the page.');
      return false;
    }

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please wait and try again.');
      return false;
    }

    setValidatingPayment(true);
    setError('');

    try {
      // Get the CardElement
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method using Stripe Elements
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: formData.paymentMethod.name,
          address: {
            line1: formData.billingAddress.street,
            city: formData.billingAddress.city,
            state: formData.billingAddress.state,
            postal_code: formData.billingAddress.zipCode,
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      // Save payment method to user account
      const response = await fetch('/api/user/payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to save payment method');
      }

      // Store payment method ID for later use
      setPaymentMethodId(paymentMethod.id);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Failed to validate payment method');
      return false;
    } finally {
      setValidatingPayment(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!user) {
      setError('User not loaded. Please refresh the page.');
      return;
    }

    if (!paymentMethodId) {
      setError('Payment method not set. Please go back to step 1.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let apiEndpoint = '';
      let requestBody = {};

      // Determine which program API to call
      if (programId === 'spiritof') {
        // Prepare SpiritOf form data
        const preparedFormData = {
          ...formData,
          paymentMethod: {
            ...formData.paymentMethod,
            stripePaymentMethodId: paymentMethodId,
          },
          autoBill: {
            ...formData.autoBill,
            amount: parseFloat(formData.autoBill.amount) || 0
          }
        };

        apiEndpoint = '/api/spiritof/onboard';
        requestBody = {
          userId: user._id,
          email: user.email,
          formData: preparedFormData,
        };
      } else if (programId === 'edynsgate') {
        // Prepare EdynsGate form data
        const preparedFormData = {
          ...formData,
          paymentMethod: {
            ...formData.paymentMethod,
            stripePaymentMethodId: paymentMethodId,
          },
          subscription: {
            ...formData.subscription,
            amount: typeof formData.subscription?.amount === 'string' 
              ? parseFloat(formData.subscription.amount) 
              : formData.subscription?.amount || 0
          }
        };

        apiEndpoint = '/api/edynsgate/onboard';
        requestBody = {
          userId: user._id,
          email: user.email,
          formData: preparedFormData,
        };
      } else {
        throw new Error(`Onboarding for ${programId} is not yet implemented`);
      }

      // Create program account
      const programResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const programData = await programResponse.json();

      if (!programData.success) {
        throw new Error(programData.message);
      }

      // Add program to user's programs array (not needed, API handles this)
      // Onboarding API already updates user.programs with status='active'

      // Success - redirect back to return URL or dashboard
      if (returnUrl) {
        // Generate fresh JWT token with updated programs
        const tokenResponse = await fetch('/api/auth/generate-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id })
        });
        
        const tokenData = await tokenResponse.json();
        
        if (tokenData.success && tokenData.token) {
          // Redirect to external site with JWT token
          window.location.href = `${returnUrl}/dashboard?token=${tokenData.token}`;
        } else {
          // Fallback: redirect without token (user can re-authenticate)
          window.location.href = returnUrl;
        }
      } else {
        router.push('/user/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-deep-black flex flex-col">
      {/* Header */}
      <header className="bg-navy border-b-2 border-neon-cyan py-6 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <FaHandsHelping className="text-neon-cyan" />
            {typeof programId === 'string' ? programId.charAt(0).toUpperCase() + programId.slice(1) : 'Program'} Onboarding
          </h1>
          <p className="text-light-grey mt-2">
            Complete the steps below to finish enrollment
          </p>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 py-12 px-8">
        <div className="max-w-4xl mx-auto">
          {programId === 'spiritof' ? (
            /* SpiritOf Onboarding Form */
            <div className="bg-navy p-8 rounded-lg border-2 border-neon-cyan">
              <h2 className="text-2xl font-bold text-white mb-6">
                Spirit of Peace - Parent Account Setup
              </h2>

              {/* Step 1: Payment Method */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-neon-cyan mb-4">
                    Step 1: Payment Information
                  </h3>
                  
                  <div className="bg-electric-blue bg-opacity-10 border border-electric-blue rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-electric-blue mb-2">
                      <FaLock />
                      <span className="font-semibold">Secure Payment</span>
                    </div>
                    <p className="text-sm text-light-grey">
                      Your payment information is encrypted and secure. We never store your card details on our servers.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-light-grey mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-2 bg-deep-black text-white border border-light-grey border-opacity-30 rounded-lg focus:border-neon-cyan focus:outline-none"
                        value={formData.paymentMethod.name}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          paymentMethod: { ...prev.paymentMethod, name: e.target.value }
                        }))}
                      />
                    </div>

                    <div>
                      <label className="block text-light-grey mb-2">Card Details</label>
                      <div className="stripe-card-element w-full px-4 py-3 bg-deep-black border border-light-grey border-opacity-30 rounded-lg">
                        <CardElement
                          options={{
                            style: {
                              base: {
                                fontSize: '16px',
                                color: '#ffffff',
                                '::placeholder': {
                                  color: '#6B7280',
                                },
                                iconColor: '#00F0FF',
                              },
                              invalid: {
                                color: '#ef4444',
                                iconColor: '#ef4444',
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
                      <p className="text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="flex justify-end mt-6">
                    <Button 
                      variant="primary" 
                      onClick={async () => {
                        const success = await handleSavePaymentMethod();
                        if (success) setStep(2);
                      }}
                      disabled={validatingPayment || !formData.paymentMethod.name}
                    >
                      {validatingPayment ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Validating Payment...
                        </span>
                      ) : 'Next: Billing Address'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Billing Address */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-neon-cyan mb-4">
                    Step 2: Billing Address
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-light-grey mb-2">Street Address</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-deep-black text-white border border-light-grey border-opacity-30 rounded-lg focus:border-neon-cyan focus:outline-none"
                        value={formData.billingAddress.street}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          billingAddress: { ...prev.billingAddress, street: e.target.value }
                        }))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-light-grey mb-2">City</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 bg-deep-black text-white border border-light-grey border-opacity-30 rounded-lg focus:border-neon-cyan focus:outline-none"
                          value={formData.billingAddress.city}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            billingAddress: { ...prev.billingAddress, city: e.target.value }
                          }))}
                        />
                      </div>
                      <div>
                        <label className="block text-light-grey mb-2">State</label>
                        <input
                          type="text"
                          maxLength={2}
                          className="w-full px-4 py-2 bg-deep-black text-white border border-light-grey border-opacity-30 rounded-lg focus:border-neon-cyan focus:outline-none"
                          value={formData.billingAddress.state}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            billingAddress: { ...prev.billingAddress, state: e.target.value.toUpperCase() }
                          }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-light-grey mb-2">Zip Code</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 bg-deep-black text-white border border-light-grey border-opacity-30 rounded-lg focus:border-neon-cyan focus:outline-none"
                        value={formData.billingAddress.zipCode}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          billingAddress: { ...prev.billingAddress, zipCode: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button variant="primary" onClick={() => setStep(3)}>
                      Next: Children & Budget
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Children & Budget */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-neon-cyan mb-4">
                    Step 3: Add Children & Set Budgets
                  </h3>

                  {formData.children.map((child, index) => (
                    <div key={index} className="bg-deep-black p-6 rounded-lg border border-light-grey border-opacity-20">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-white">Child {index + 1}</h4>
                        {formData.children.length > 1 && (
                          <button
                            onClick={() => removeChild(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-light-grey mb-2">First Name</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 bg-navy text-white border border-light-grey border-opacity-30 rounded-lg focus:border-neon-cyan focus:outline-none"
                            value={child.firstName}
                            onChange={(e) => updateChild(index, 'firstName', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-light-grey mb-2">Last Name</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 bg-navy text-white border border-light-grey border-opacity-30 rounded-lg focus:border-neon-cyan focus:outline-none"
                            value={child.lastName}
                            onChange={(e) => updateChild(index, 'lastName', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-light-grey mb-2">Date of Birth</label>
                          <input
                            type="date"
                            className="w-full px-4 py-2 bg-navy text-white border border-light-grey border-opacity-30 rounded-lg focus:border-neon-cyan focus:outline-none"
                            value={child.dateOfBirth}
                            onChange={(e) => updateChild(index, 'dateOfBirth', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-light-grey mb-2">Grade</label>
                          <input
                            type="text"
                            placeholder="e.g., 3rd"
                            className="w-full px-4 py-2 bg-navy text-white border border-light-grey border-opacity-30 rounded-lg focus:border-neon-cyan focus:outline-none"
                            value={child.grade}
                            onChange={(e) => updateChild(index, 'grade', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-light-grey mb-2">
                            Weekly Budget (Magic Points)
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="500"
                            className="w-full px-4 py-2 bg-navy text-white border border-light-grey border-opacity-30 rounded-lg focus:border-neon-cyan focus:outline-none"
                            value={child.weeklyBudget}
                            onChange={(e) => updateChild(index, 'weeklyBudget', parseInt(e.target.value) || 0)}
                          />
                          <p className="text-xs text-light-grey mt-1">
                            100 magic points = $1.00
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addChild}
                    className="w-full py-3 border-2 border-dashed border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:bg-opacity-10 transition-colors"
                  >
                    + Add Another Child
                  </button>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button variant="primary" onClick={() => setStep(4)}>
                      Next: Auto-Bill Settings
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Auto-Bill Settings */}
              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-neon-cyan mb-4">
                    Step 4: Auto-Bill Settings
                  </h3>

                  <div className="bg-deep-black p-6 rounded-lg border border-light-grey border-opacity-20">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-white font-semibold">Enable Auto-Bill</label>
                      <input
                        type="checkbox"
                        className="w-6 h-6"
                        checked={formData.autoBill.enabled}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          autoBill: { ...prev.autoBill, enabled: e.target.checked }
                        }))}
                      />
                    </div>

                    {formData.autoBill.enabled && (
                      <>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-light-grey mb-2">Monthly Amount ($)</label>
                            <input
                              type="text"
                              inputMode="decimal"
                              placeholder="50.00"
                              className="w-full px-4 py-2 bg-navy text-white border border-light-grey border-opacity-30 rounded-lg focus:border-neon-cyan focus:outline-none"
                              value={formData.autoBill.amount}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow numbers and decimal point
                                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    autoBill: { ...prev.autoBill, amount: value }
                                  }));
                                }
                              }}
                            />
                            <p className="text-xs text-light-grey mt-1">
                              = {calculateTotalMagicPoints(parseFloat(formData.autoBill.amount) || 0)} magic points per month
                            </p>
                          </div>

                          <div>
                            <label className="block text-light-grey mb-2">Billing Frequency</label>
                            <select
                              className="w-full px-4 py-2 bg-navy text-white border border-light-grey border-opacity-30 rounded-lg focus:border-neon-cyan focus:outline-none"
                              value={formData.autoBill.frequency}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                autoBill: { ...prev.autoBill, frequency: e.target.value }
                              }))}
                            >
                              <option value="monthly">Monthly</option>
                              <option value="biweekly">Every 2 Weeks</option>
                              <option value="weekly">Weekly</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-4 p-4 bg-electric-blue bg-opacity-10 border border-electric-blue rounded-lg">
                          <p className="text-sm text-white">
                            💡 Funds will be automatically converted to Magic Points and added to your wallet balance.
                            Magic Points can be used for all activities on the Santa site.
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
                      <p className="text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep(3)}>
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleCompleteOnboarding}
                      disabled={loading || !user}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : !user ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </span>
                      ) : 'Complete Onboarding'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Default Placeholder for other programs */
            <div className="bg-navy p-8 rounded-lg border-2 border-neon-cyan">
              <h2 className="text-2xl font-bold text-white mb-6">
                Onboarding Steps
              </h2>

              {/* Steps List */}
              <div className="space-y-4 mb-8">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-deep-black rounded-lg border border-light-grey border-opacity-20"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-cyan bg-opacity-20 flex items-center justify-center">
                      <span className="text-neon-cyan font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white">{step}</p>
                    </div>
                    <FaCheckCircle className="text-light-grey opacity-30" />
                  </div>
                ))}
              </div>

              {/* Placeholder for actual onboarding content */}
              <div className="bg-electric-blue bg-opacity-10 border-2 border-electric-blue rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-2">
                  📝 Onboarding Form Coming Soon
                </h3>
                <p className="text-light-grey mb-4">
                  This is a placeholder for the {programId} onboarding process.
                  In production, you&apos;ll complete the steps listed above.
                </p>
                <p className="text-light-grey text-sm">
                  For now, click &quot;Complete Onboarding&quot; below to finish enrollment and be added to the program.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => router.push('/user/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCompleteOnboarding}
                  disabled={loading || !user}
                  className="flex-1"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : !user ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : 'Complete Onboarding'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <React.Suspense fallback={
      <div className="flex-1 bg-deep-black flex items-center justify-center">
        <div className="text-2xl text-light-grey">Loading...</div>
      </div>
    }>
      <Elements stripe={stripePromise}>
        <OnboardingForm />
      </Elements>
    </React.Suspense>
  );
}
