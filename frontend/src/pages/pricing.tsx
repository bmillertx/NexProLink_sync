import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PricingPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/how-it-works#pricing');
  }, [router]);
  
  return null;
};

export default PricingPage;
