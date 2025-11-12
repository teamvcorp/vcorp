"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Button from '../../components/ui/Button';
import { 
  FaHandsHelping, 
  FaFistRaised, 
  FaYinYang, 
  FaGraduationCap,
  FaCheckCircle,
  FaShieldAlt,
  FaCalendarAlt,
  FaUsers
} from 'react-icons/fa';

// Program data
const programsData = {
  spiritof: {
    title: 'Spirit Of',
    tagline: 'Making a difference, one community at a time',
    icon: FaHandsHelping,
    accentColor: 'electric-blue',
    heroImage: '/group.jpg',
    about: [
      'Spirit Of is our flagship community impact program dedicated to creating positive change through volunteer initiatives and community engagement.',
      'We connect passionate individuals with meaningful opportunities to make a real difference in their communities.',
      'From local food drives to educational workshops, Spirit Of empowers members to be the change they want to see.'
    ],
    features: [
      'Volunteer Opportunities',
      'Community Events',
      'Social Impact Projects',
      'Networking & Collaboration'
    ],
    targetAudience: 'Anyone passionate about making a difference - individuals, families, and community groups.',
    pricing: {
      free: true,
      details: 'Spirit Of is free to join. Simply register and start participating in events.'
    },
    upcomingEvents: [
      { title: 'Community Food Drive', date: 'Nov 25, 2025', location: 'Downtown Community Center' },
      { title: 'Youth Mentorship Workshop', date: 'Dec 5, 2025', location: 'Online' },
      { title: 'Holiday Toy Collection', date: 'Dec 15, 2025', location: 'Multiple Locations' }
    ],
    faqs: [
      {
        question: 'How do I get started with Spirit Of?',
        answer: 'Simply register through our platform, complete your profile, and browse upcoming volunteer opportunities that match your interests and availability.'
      },
      {
        question: 'Is there a time commitment required?',
        answer: 'No! Participate as much or as little as you like. We have one-time events and ongoing projects to fit any schedule.'
      },
      {
        question: 'Can I suggest my own project ideas?',
        answer: 'Absolutely! We encourage members to propose initiatives. Submit your ideas through your member dashboard for review.'
      }
    ],
    testimonials: [
      {
        name: 'Sarah Johnson',
        role: 'Volunteer',
        quote: 'Spirit Of connected me with my community in ways I never imagined. Every event is meaningful and impactful.'
      },
      {
        name: 'Michael Chen',
        role: 'Community Leader',
        quote: 'The organization and dedication of this program is outstanding. Proud to be part of this movement.'
      }
    ]
  },
  fyght4: {
    title: 'Fyght4',
    tagline: 'Advocacy and support when you need it most',
    icon: FaFistRaised,
    accentColor: 'neon-pink',
    heroImage: '/family.jpeg',
    about: [
      'Fyght4 is our advocacy and support program dedicated to standing up for those who need it most.',
      'We provide resources, guidance, and a supportive community for individuals facing challenges and seeking positive change.',
      'Through education, advocacy, and peer support, Fyght4 empowers members to overcome obstacles and thrive.'
    ],
    features: [
      'Peer Support Groups',
      'Advocacy Resources',
      'Educational Workshops',
      'One-on-One Mentoring'
    ],
    targetAudience: 'Individuals seeking support, guidance, and advocacy in navigating life\'s challenges.',
    pricing: {
      free: false,
      tiers: [
        { name: 'Basic Support', price: '$20/month', features: ['Access to peer groups', 'Monthly workshops', 'Resource library'] },
        { name: 'Full Access', price: '$50/month', features: ['Everything in Basic', 'One-on-one mentoring', 'Priority support', 'Exclusive events'] }
      ]
    },
    upcomingEvents: [
      { title: 'Mental Health Awareness Workshop', date: 'Nov 22, 2025', location: 'Online' },
      { title: 'Advocacy Skills Training', date: 'Dec 3, 2025', location: 'Community Center' },
      { title: 'Support Group Meetup', date: 'Dec 10, 2025', location: 'Online' }
    ],
    faqs: [
      {
        question: 'Is my information kept confidential?',
        answer: 'Yes, we take privacy very seriously. All personal information and discussions within support groups are strictly confidential.'
      },
      {
        question: 'What kind of support is provided?',
        answer: 'We offer peer support groups, professional mentoring, educational resources, and advocacy guidance tailored to your needs.'
      },
      {
        question: 'Can I cancel my membership anytime?',
        answer: 'Yes, you can cancel anytime with no penalties. We want you to feel comfortable and supported throughout your journey.'
      }
    ],
    testimonials: [
      {
        name: 'Alex Rodriguez',
        role: 'Member',
        quote: 'Fyght4 gave me the tools and support I needed during a difficult time. Forever grateful for this community.'
      },
      {
        name: 'Jamie Lee',
        role: 'Member',
        quote: 'The mentors here truly care. They helped me find my voice and stand up for what matters.'
      }
    ]
  },
  taekwondo: {
    title: 'Taekwondo Academy',
    tagline: 'Discipline. Respect. Excellence.',
    icon: FaYinYang,
    accentColor: 'neon-cyan',
    heroImage: '/group.jpg',
    about: [
      'Our Taekwondo Academy combines traditional martial arts training with modern character development principles.',
      'Students of all ages and skill levels learn discipline, respect, self-defense, and physical fitness in a supportive environment.',
      'Led by certified instructors with decades of experience, we focus on building confidence and lifelong skills.'
    ],
    features: [
      'Classes for All Ages (Kids, Teens, Adults)',
      'Belt Progression System',
      'Competition Training (Optional)',
      'Self-Defense Techniques',
      'Physical Fitness & Conditioning'
    ],
    targetAudience: 'Children (ages 5+), teens, and adults looking to learn martial arts, build confidence, and improve fitness.',
    pricing: {
      free: false,
      tiers: [
        { name: 'Youth Program', price: '$80/month', features: ['2 classes per week', 'Belt progression', 'Uniform included'] },
        { name: 'Adult Program', price: '$100/month', features: ['3 classes per week', 'Open gym access', 'Competition training'] },
        { name: 'Family Plan', price: '$200/month', features: ['Unlimited classes', 'All family members', 'Private lessons discount'] }
      ]
    },
    upcomingEvents: [
      { title: 'Belt Testing Ceremony', date: 'Dec 1, 2025', location: 'Main Dojang' },
      { title: 'Youth Tournament', date: 'Dec 12, 2025', location: 'Sports Complex' },
      { title: 'Self-Defense Workshop', date: 'Dec 20, 2025', location: 'Main Dojang' }
    ],
    faqs: [
      {
        question: 'Do I need prior martial arts experience?',
        answer: 'Not at all! We welcome complete beginners. Our instructors will guide you from day one, regardless of experience level.'
      },
      {
        question: 'What should I wear to my first class?',
        answer: 'Comfortable athletic clothing is fine for your first class. Once enrolled, you\'ll receive a uniform (dobok) as part of your membership.'
      },
      {
        question: 'How long does it take to earn a black belt?',
        answer: 'Typically 3-5 years with consistent training, but everyone progresses at their own pace. Focus on learning, not just the belt.'
      },
      {
        question: 'Is Taekwondo safe for children?',
        answer: 'Yes! Our kids classes emphasize safety, control, and age-appropriate techniques. Instructors are trained in child development and safety.'
      }
    ],
    testimonials: [
      {
        name: 'David Martinez',
        role: 'Parent',
        quote: 'My son\'s confidence has skyrocketed since joining. The instructors are patient, skilled, and truly care about the students.'
      },
      {
        name: 'Emily Watson',
        role: 'Adult Student',
        quote: 'As a complete beginner at 35, I was nervous. But this academy made me feel welcome and capable. Best decision I\'ve made!'
      }
    ]
  },
  edyensgate: {
    title: 'Edyens Gate',
    tagline: 'Learn anywhere, anytime',
    icon: FaGraduationCap,
    accentColor: 'neon-purple',
    heroImage: '/education.jpeg',
    about: [
      'Edyens Gate is our online learning platform providing accessible, high-quality education to learners worldwide.',
      'From professional development courses to personal enrichment programs, we offer flexible learning paths for every goal.',
      'Our courses are designed by industry experts and educators, ensuring practical, real-world knowledge you can apply immediately.'
    ],
    features: [
      'On-Demand Course Library',
      'Live Webinars & Workshops',
      'Certification Programs',
      'Community Forums',
      'Mobile & Desktop Access'
    ],
    targetAudience: 'Lifelong learners, professionals seeking upskilling, students, and anyone pursuing personal growth.',
    pricing: {
      free: false,
      tiers: [
        { name: 'Individual Access', price: '$30/month', features: ['Full course library', 'Certificates of completion', 'Community access'] },
        { name: 'Premium', price: '$60/month', features: ['Everything in Individual', 'Live webinars', 'Priority instructor support', 'Early access to new courses'] },
        { name: 'Enterprise', price: 'Contact for pricing', features: ['Team accounts', 'Custom learning paths', 'Admin dashboard', 'Dedicated support'] }
      ]
    },
    upcomingEvents: [
      { title: 'Web Development Bootcamp', date: 'Dec 2, 2025', location: 'Online' },
      { title: 'Digital Marketing Masterclass', date: 'Dec 9, 2025', location: 'Online' },
      { title: 'Leadership & Management Workshop', date: 'Dec 16, 2025', location: 'Online' }
    ],
    faqs: [
      {
        question: 'Can I access courses on mobile devices?',
        answer: 'Yes! Our platform is fully responsive and works seamlessly on desktop, tablet, and mobile devices.'
      },
      {
        question: 'Do I get certificates after completing courses?',
        answer: 'Yes, all completed courses come with a certificate of completion that you can share on LinkedIn and your resume.'
      },
      {
        question: 'How often are new courses added?',
        answer: 'We add new courses monthly, and continuously update existing content to ensure relevance and quality.'
      },
      {
        question: 'Is there a free trial available?',
        answer: 'Yes! We offer a 7-day free trial with full access to our course library. No credit card required to start.'
      }
    ],
    testimonials: [
      {
        name: 'Rachel Green',
        role: 'Student',
        quote: 'The courses are practical and engaging. I landed my dream job thanks to the skills I learned here!'
      },
      {
        name: 'Tom Anderson',
        role: 'Professional',
        quote: 'Flexible learning that fits my schedule. The quality of instruction rivals traditional universities.'
      }
    ]
  }
};

const ProgramDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const program = programsData[slug as keyof typeof programsData];

  if (!program) {
    return (
      <main className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Program Not Found</h1>
          <Button variant="primary" href="/programs">
            View All Programs
          </Button>
        </div>
      </main>
    );
  }

  const IconComponent = program.icon;

  return (
    <main className="flex-1 bg-deep-black">
      {/* Hero Banner */}
      <section
        className="h-[60vh] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${program.heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-neon" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="text-7xl mb-4 text-neon-cyan">
            <IconComponent />
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4">
            {program.title}
          </h1>
          <p className="text-3xl text-neon-cyan">{program.tagline}</p>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-navy py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-extrabold text-white mb-8">About {program.title}</h2>
          <div className="space-y-4 text-lg text-light-grey leading-relaxed">
            {program.about.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-deep-black py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-extrabold text-white mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {program.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 bg-navy p-6 rounded-lg border-2 border-neon-cyan">
                <FaCheckCircle className="text-3xl text-neon-cyan shrink-0" />
                <span className="text-xl text-white">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="bg-navy py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FaUsers className="text-6xl text-neon-pink mx-auto mb-6" />
          <h2 className="text-4xl font-extrabold text-white mb-6">Who Is This For?</h2>
          <p className="text-xl text-light-grey leading-relaxed">{program.targetAudience}</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-deep-black py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-extrabold text-white mb-12 text-center">Pricing & Membership</h2>
          
          {program.pricing.free ? (
            <div className="bg-navy p-12 rounded-lg border-2 border-neon-cyan text-center max-w-2xl mx-auto">
              <h3 className="text-4xl font-bold text-neon-cyan mb-4">Free to Join!</h3>
              <p className="text-xl text-light-grey mb-8">
                {'details' in program.pricing ? program.pricing.details : ''}
              </p>
              <Button variant="primary" size="lg" href={`/register?program=${slug}`}>
                Register Now
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {'tiers' in program.pricing && program.pricing.tiers?.map((tier, index) => (
                <div
                  key={index}
                  className={`
                    bg-navy p-8 rounded-lg border-2 border-neon-cyan
                    hover:shadow-neon-cyan-lg transition-all duration-300
                    flex flex-col
                  `}
                >
                  <h3 className="text-3xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="text-4xl font-extrabold text-neon-cyan mb-6">{tier.price}</div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start space-x-2 text-light-grey">
                        <FaCheckCircle className="text-neon-cyan mt-1 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="primary" href={`/register?program=${slug}&tier=${tier.name}`}>
                    Select Plan
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Identity Verification Info */}
          <div className="mt-16 bg-navy p-8 rounded-lg border-l-4 border-neon-pink">
            <div className="flex items-start space-x-4">
              <FaShieldAlt className="text-4xl text-neon-pink shrink-0" />
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">Safe & Secure Registration</h4>
                <p className="text-light-grey leading-relaxed">
                  We use Stripe Identity verification to keep our community safe. Your privacy is protected, 
                  and verification takes just a few minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-navy py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-extrabold text-white mb-12 text-center">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {program.upcomingEvents.map((event, index) => (
              <div key={index} className="bg-deep-black p-6 rounded-lg border-2 border-electric-blue">
                <FaCalendarAlt className="text-3xl text-electric-blue mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">{event.title}</h4>
                <p className="text-neon-cyan font-semibold mb-1">{event.date}</p>
                <p className="text-light-grey">{event.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-deep-black py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-extrabold text-white mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {program.faqs.map((faq, index) => (
              <div key={index} className="bg-navy p-6 rounded-lg border-l-4 border-neon-cyan">
                <h4 className="text-xl font-bold text-white mb-3">{faq.question}</h4>
                <p className="text-light-grey leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-navy py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-extrabold text-white mb-12 text-center">What Our Members Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {program.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-deep-black p-8 rounded-lg border-2 border-neon-pink">
                <p className="text-lg text-light-grey italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="text-xl font-bold text-white">{testimonial.name}</p>
                  <p className="text-neon-pink">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-deep-black py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold text-white mb-6">Ready to Join?</h2>
          <p className="text-xl text-light-grey mb-8">
            Take the first step towards {program.title.toLowerCase()}. Register today and become part of our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" href={`/register?program=${slug}`}>
              Register Now
            </Button>
            <Button variant="outline" size="lg" href="/programs">
              View All Programs
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProgramDetailPage;
