"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navigation = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/programs', label: 'Programs' },
    { href: '/#impact', label: 'Get Involved' },
  ];

  return (
    <nav className="bg-navy pt-20 border-b-4 border-electric-blue sticky top-0 z-50">
      <div className="max-w-7xl mx-auto ">
        <div className="flex  justify-evenly h-24">
          {/* Logo */}
          <Link href="/" className="flex  items-center shrink-0">
            <div className=" ">
              <Image
                src="/valogo.png"
                width={100}
                height={120}
                alt="Von Der Becke Academy Corp Logo"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  text-2xl font-bold uppercase transition-all duration-300
                  ${pathname === link.href ? 'text-neon-purple' : 'text-white'}
                  hover:text-neon-cyan hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]
                `}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Sign In Button */}
            <Link
              href="/auth/signin"
              className="px-6 py-2 bg-transparent border-2 border-neon-cyan text-neon-cyan rounded-full font-bold uppercase hover:bg-neon-cyan hover:text-deep-black transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          
          <button
            className="md:hidden text-white text-3xl  hover:text-neon-cyan hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] "
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  block text-right mr-6 py-3 text-xl font-bold uppercase
                  ${pathname === link.href ? 'text-neon-purple' : 'text-white'}
                  hover:text-neon-cyan
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Sign In Button */}
            <Link
              href="/auth/signin"
              className="block text-right mr-6 py-3 text-xl font-bold uppercase text-white hover:text-white hover:text-neon-cyan"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
