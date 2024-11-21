import { FC } from 'react';
import {
  CodeBracketIcon,
  CloudIcon,
  DevicePhoneMobileIcon,
  CpuChipIcon,
  LockClosedIcon,
  CircleStackIcon,
  PaintBrushIcon,
  CommandLineIcon,
  CubeIcon,
  ChartBarIcon,
  GlobeAltIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

interface Specialty {
  name: string;
  icon: typeof CodeBracketIcon;
  description: string;
  color: string;
  popular?: boolean;
}

const specialties: Specialty[] = [
  {
    name: 'Full Stack Development',
    icon: CodeBracketIcon,
    description: 'End-to-end application development expertise',
    color: 'indigo',
    popular: true,
  },
  {
    name: 'Cloud Architecture',
    icon: CloudIcon,
    description: 'AWS, Azure, and GCP solutions',
    color: 'blue',
    popular: true,
  },
  {
    name: 'Mobile Development',
    icon: DevicePhoneMobileIcon,
    description: 'iOS, Android, and cross-platform apps',
    color: 'green',
    popular: true,
  },
  {
    name: 'AI/ML',
    icon: CpuChipIcon,
    description: 'Machine learning and AI solutions',
    color: 'purple',
    popular: true,
  },
  {
    name: 'Security',
    icon: LockClosedIcon,
    description: 'Application and infrastructure security',
    color: 'red',
  },
  {
    name: 'Database Design',
    icon: CircleStackIcon,
    description: 'SQL and NoSQL database architecture',
    color: 'yellow',
  },
  {
    name: 'UI/UX Design',
    icon: PaintBrushIcon,
    description: 'User interface and experience design',
    color: 'pink',
  },
  {
    name: 'DevOps',
    icon: CommandLineIcon,
    description: 'CI/CD and infrastructure automation',
    color: 'teal',
  },
  {
    name: 'Blockchain',
    icon: CubeIcon,
    description: 'Web3 and blockchain development',
    color: 'orange',
  },
  {
    name: 'Data Analytics',
    icon: ChartBarIcon,
    description: 'Big data and analytics solutions',
    color: 'cyan',
  },
  {
    name: 'API Development',
    icon: GlobeAltIcon,
    description: 'RESTful and GraphQL APIs',
    color: 'lime',
  },
  {
    name: 'System Architecture',
    icon: RocketLaunchIcon,
    description: 'Scalable system design',
    color: 'emerald',
  },
];

interface SpecialtiesGridProps {
  onSpecialtyClick: (specialty: string) => void;
  selectedSpecialties: string[];
}

export const SpecialtiesGrid: FC<SpecialtiesGridProps> = ({
  onSpecialtyClick,
  selectedSpecialties,
}) => {
  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Explore by Specialty
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Find experts in your area of interest
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {specialties.map((specialty) => {
          const isSelected = selectedSpecialties.includes(specialty.name);
          const IconComponent = specialty.icon;

          return (
            <button
              key={specialty.name}
              onClick={() => onSpecialtyClick(specialty.name)}
              className={`relative group p-4 rounded-xl transition-all duration-300 ${
                isSelected
                  ? `bg-${specialty.color}-100 dark:bg-${specialty.color}-900`
                  : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
              } border border-gray-200 dark:border-gray-700 shadow-sm`}
            >
              {specialty.popular && (
                <span className="absolute top-2 right-2 text-xs font-medium text-primary-600 dark:text-primary-400">
                  Popular
                </span>
              )}
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center
                ${
                  isSelected
                    ? `text-${specialty.color}-600 dark:text-${specialty.color}-400`
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <IconComponent className="w-6 h-6" />
              </div>
              <h3
                className={`text-sm font-semibold text-center mb-1 ${
                  isSelected
                    ? `text-${specialty.color}-700 dark:text-${specialty.color}-300`
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {specialty.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {specialty.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
