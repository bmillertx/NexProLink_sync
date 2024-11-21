import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { classNames } from '@/utils/styles';
import { useTheme } from '@/context/ThemeContext';

interface TabItem {
  name: string;
  icon?: React.ComponentType<any>;
  content: React.ReactNode;
}

interface DashboardTabsProps {
  tabs: TabItem[];
}

export default function DashboardTabs({ tabs }: DashboardTabsProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className="w-full px-2 py-8 sm:px-0">
      <Tab.Group>
        <Tab.List className={`flex space-x-1 rounded-xl p-1 ${
          isDarkMode ? 'bg-gray-700/50' : 'bg-blue-900/20'
        }`}>
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              data-tab={tab.name.toLowerCase()}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors duration-200',
                  'ring-white/60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? isDarkMode
                      ? 'bg-gray-700 text-white shadow-lg'
                      : 'bg-white shadow text-blue-700'
                    : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                  isDarkMode
                    ? 'ring-offset-gray-800'
                    : 'ring-offset-blue-400'
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                {tab.icon && <tab.icon className="h-5 w-5" />}
                <span>{tab.name}</span>
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl p-4',
                isDarkMode ? 'bg-gray-800' : 'bg-white',
                'ring-white/60 ring-offset-2 focus:outline-none focus:ring-2',
                isDarkMode ? 'ring-offset-gray-800' : 'ring-offset-blue-400'
              )}
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
