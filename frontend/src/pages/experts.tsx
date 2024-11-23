import type { NextPage } from 'next';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { AdvancedSearch, SearchFilters } from '../components/experts/AdvancedSearch';
import { ExpertCardEnhanced } from '../components/experts/ExpertCardEnhanced';
import { Expert } from '../types/expert';
import { useToast } from '@/hooks/useToast';
import { expertService } from '@/services/expertService';
import { mockExperts } from '@/data/mockExperts';

const ExpertsPage: NextPage = () => {
  const [experts, setExperts] = useState<Expert[]>(mockExperts);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const loadExperts = async () => {
      if (typeof window === 'undefined') return; // Skip on server-side

      setLoading(true);
      try {
        const loadedExperts = await expertService.getExperts();
        setExperts(loadedExperts);
      } catch (error) {
        console.error('Error loading experts:', error);
        toast.error('Failed to load experts. Using local data.');
        setExperts(mockExperts); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    loadExperts();
  }, [toast]);

  const handleSearch = useCallback(async (searchQuery: string, filters: SearchFilters) => {
    if (typeof window === 'undefined') return; // Skip on server-side

    setLoading(true);
    try {
      const searchResults = await expertService.searchExperts(searchQuery, filters);
      setExperts(searchResults);
    } catch (error) {
      console.error('Error searching experts:', error);
      toast.error('Failed to search experts. Please try again.');
      
      // Fallback to local filtering if Firebase fails
      const filteredExperts = mockExperts.filter(expert => {
        const matchesSearch = !searchQuery || 
          expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expert.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesRating = !filters.rating || expert.rating >= filters.rating;
        const matchesPrice = expert.hourlyRate >= filters.priceRange[0] && 
                           expert.hourlyRate <= filters.priceRange[1];
        const matchesLocation = !filters.location || 
                              expert.location.toLowerCase().includes(filters.location.toLowerCase());

        return matchesSearch && matchesRating && matchesPrice && matchesLocation;
      });
      
      setExperts(filteredExperts);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleBook = (expert: Expert) => {
    router.push(`/booking/${expert.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Perfect Expert
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Connect with top professionals in your field
          </p>
        </motion.div>

        <div className="mb-12">
          <AdvancedSearch onSearch={handleSearch} />
        </div>

        <AnimatePresence>
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl text-gray-600 dark:text-gray-400"
              >
                Loading experts...
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {experts.map((expert) => (
                <ExpertCardEnhanced
                  key={expert.id}
                  expert={expert}
                  onBook={handleBook}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && experts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              No experts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Try adjusting your search criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExpertsPage;
