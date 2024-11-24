import { useState } from 'react';
import { useRouter } from 'next/router';

interface Consultant {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  hourlyRate: number;
  imageUrl: string;
  description: string;
}

// Mock consultant data
const mockConsultants: Consultant[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Business Strategy',
    rating: 4.8,
    hourlyRate: 150,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    description: 'Expert in business transformation and strategic planning with 15+ years of experience.',
  },
  {
    id: '2',
    name: 'Michael Chen',
    specialty: 'Financial Advisory',
    rating: 4.9,
    hourlyRate: 200,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    description: 'Specialized in investment strategies and financial planning for startups and SMEs.',
  },
  {
    id: '3',
    name: 'Emma Williams',
    specialty: 'Marketing Strategy',
    rating: 4.7,
    hourlyRate: 125,
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    description: 'Digital marketing expert focusing on growth strategies and brand development.',
  },
];

export default function ConsultantsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const specialties = ['all', 'Business Strategy', 'Financial Advisory', 'Marketing Strategy'];

  const filteredConsultants = mockConsultants.filter(consultant => {
    const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || consultant.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Find Your Expert Consultant</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Connect with industry-leading professionals for personalized consultation sessions
          </p>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <input
            type="text"
            placeholder="Search consultants..."
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>
                {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredConsultants.map((consultant) => (
            <div
              key={consultant.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
              onClick={() => router.push(`/consultants/${consultant.id}`)}
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={consultant.imageUrl}
                  alt={consultant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{consultant.name}</h3>
                <p className="mt-2 text-indigo-600 font-medium">{consultant.specialty}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-gray-600">{consultant.rating}</span>
                  </div>
                  <span className="text-gray-900 font-medium">${consultant.hourlyRate}/hr</span>
                </div>
                <p className="mt-4 text-gray-500 text-sm line-clamp-2">{consultant.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
