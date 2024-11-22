import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  UserCircleIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

interface ExpertProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  specializations: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  experience: {
    position: string;
    company: string;
    duration: string;
    description: string;
  }[];
  rating: number;
  totalReviews: number;
}

export default function ProfileTab() {
  const { isDarkMode } = useTheme();
  const [profile, setProfile] = useState<ExpertProfile>({
    name: 'Dr. Sarah Johnson',
    title: 'Senior Medical Consultant',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Board-certified medical professional with over 15 years of experience in internal medicine and preventive healthcare.',
    specializations: [
      'Internal Medicine',
      'Preventive Care',
      'Chronic Disease Management',
      'Telemedicine',
    ],
    education: [
      {
        degree: 'Doctor of Medicine',
        institution: 'Stanford University School of Medicine',
        year: '2008',
      },
      {
        degree: 'Bachelor of Science in Biology',
        institution: 'University of California, Berkeley',
        year: '2004',
      },
    ],
    experience: [
      {
        position: 'Senior Medical Consultant',
        company: 'Healthcare Partners Medical Group',
        duration: '2015 - Present',
        description:
          'Lead consultant for telemedicine initiatives and chronic disease management programs.',
      },
      {
        position: 'Internal Medicine Physician',
        company: 'San Francisco General Hospital',
        duration: '2008 - 2015',
        description:
          'Provided comprehensive patient care and supervised medical residents.',
      },
    ],
    rating: 4.8,
    totalReviews: 127,
  });

  return (
    <div className="p-6">
      {/* Header Section */}
      <div
        className={`rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow p-6 mb-6`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCircleIcon
                className={`h-12 w-12 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}
              />
            </div>
            <div className="ml-4">
              <h1
                className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {profile.name}
              </h1>
              <p
                className={`text-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {profile.title}
              </p>
              <div className="flex items-center mt-2">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span
                  className={`ml-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {profile.rating} ({profile.totalReviews} reviews)
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPinIcon
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              />
              <span
                className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {profile.location}
              </span>
            </div>
            <div className="flex items-center">
              <PhoneIcon
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              />
              <span
                className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {profile.phone}
              </span>
            </div>
            <div className="flex items-center">
              <EnvelopeIcon
                className={`h-5 w-5 mr-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              />
              <span
                className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {profile.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div
        className={`rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow p-6 mb-6`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          About Me
        </h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {profile.bio}
        </p>
      </div>

      {/* Specializations */}
      <div
        className={`rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow p-6 mb-6`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Specializations
        </h2>
        <div className="flex flex-wrap gap-2">
          {profile.specializations.map((spec, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isDarkMode
                  ? 'bg-blue-900 text-blue-200'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Education */}
      <div
        className={`rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow p-6 mb-6`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Education
        </h2>
        <div className="space-y-4">
          {profile.education.map((edu, index) => (
            <div key={index} className="flex items-start">
              <AcademicCapIcon
                className={`h-6 w-6 mr-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              />
              <div>
                <h3
                  className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {edu.degree}
                </h3>
                <p
                  className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {edu.institution}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {edu.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div
        className={`rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow p-6`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Professional Experience
        </h2>
        <div className="space-y-4">
          {profile.experience.map((exp, index) => (
            <div key={index} className="flex items-start">
              <BriefcaseIcon
                className={`h-6 w-6 mr-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              />
              <div>
                <h3
                  className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {exp.position}
                </h3>
                <p
                  className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {exp.company}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {exp.duration}
                </p>
                <p
                  className={`mt-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
