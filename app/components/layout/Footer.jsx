"use client";

import React from 'react';
import Link from 'next/link';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaEnvelopeOpenText, 
  FaPhoneAlt 
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-navy text-white flex w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Section */}
          <div className="space-y-8">
            {/* Social Media */}
            <div>
              <h4 className="text-2xl font-bold mb-4">Find, Follow and Connect</h4>
              <div className="flex space-x-4">
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelopeOpenText, FaPhoneAlt].map((Icon, index) => (
                  <button
                    key={index}
                    className="bg-electric-blue p-3 rounded-full hover:bg-lt-blue hover:shadow-lg transition-all duration-300"
                  >
                    <Icon className="text-xl" />
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-2xl font-bold mb-4">Subscribe to our Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="flex-1 px-4 py-3 rounded-l-lg text-navy focus:outline-none"
                />
                <button className="bg-electric-blue px-6 py-3 rounded-r-lg font-bold hover:bg-lt-blue transition-all">
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-neon-cyan">Mission Statement</h3>
            <p className="text-lg leading-relaxed">
              Enabling social progress through the power of education, compassion, and innovation.
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="hover:text-lt-blue transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-lt-blue transition-colors">
                Terms of Service
              </Link>
              <Link href="/financial" className="hover:text-lt-blue transition-colors">
                Financial Records
              </Link>
              <Link href="/admin/login" className="hover:text-lt-blue transition-colors opacity-60">
                Admin Login
              </Link>
            </div>

            <p className="text-sm opacity-75">
              &copy; {new Date().getFullYear()} The Von Der Becke Academy Corp. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
