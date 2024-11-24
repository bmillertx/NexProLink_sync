import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '@/config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const CreateTestAccount = () => {
  const router = useRouter();

  useEffect(() => {
    const createAccount = async () => {
      try {
        // Create auth account
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          'test.expert@nexprolink.com',
          'testpassword123'
        );

        // Create expert profile in Firestore
        const expertProfile = {
          uid: userCredential.user.uid,
          email: 'test.expert@nexprolink.com',
          name: 'Chef Mario Romano',
          title: 'Master Chef & Culinary Instructor',
          rating: 4.8,
          reviews: 95,
          hourlyRate: 120,
          availability: {
            nextAvailable: 'Today at 7:00 PM',
            schedule: [
              { day: 'Thu', slots: ['10:00 AM', '2:00 PM', '7:00 PM'] },
              { day: 'Fri', slots: ['11:00 AM', '3:00 PM', '6:00 PM'] },
              { day: 'Sat', slots: ['9:00 AM', '1:00 PM', '5:00 PM'] }
            ]
          },
          specialties: ['Italian Cuisine', 'Pastry', 'Wine Pairing', 'Restaurant Management'],
          imageUrl: 'https://randomuser.me/api/portraits/men/8.jpg',
          bio: `With 20 years of culinary expertise, I bring the authentic flavors of Italy to your kitchen. From running Michelin-starred restaurants to teaching at prestigious culinary schools, I'm passionate about sharing the art of fine cooking.`,
          experience: {
            years: 20,
            highlights: [
              'Executive Chef at 2-Michelin Star restaurant in Rome',
              'Culinary Director for international restaurant group',
              'Author of "The Art of Italian Cooking"',
              'Featured on multiple cooking shows and food networks'
            ]
          },
          services: [
            {
              type: 'oneOnOne',
              title: 'Private Cooking Session',
              description: 'Personalized cooking class in your kitchen. Learn techniques, recipes, and culinary secrets.',
              duration: '2 hours',
              price: 200
            },
            {
              type: 'event',
              title: 'Group Cooking Class',
              description: 'Interactive cooking class for small groups. Perfect for team building or special occasions.',
              duration: '3 hours',
              price: 150
            },
            {
              type: 'course',
              title: 'Italian Cuisine Mastery',
              description: 'Comprehensive course covering traditional Italian cooking techniques and recipes.',
              duration: '6 weeks',
              price: 799
            }
          ],
          upcomingEvents: [
            {
              id: 'event3',
              title: 'Pasta Making Masterclass',
              date: 'June 18, 2024',
              time: '6:00 PM PST',
              duration: '2.5 hours',
              price: 129,
              spotsLeft: 8
            },
            {
              id: 'event4',
              title: 'Wine & Dine: Italian Summer Feast',
              date: 'June 25, 2024',
              time: '7:00 PM PST',
              duration: '3 hours',
              price: 179,
              spotsLeft: 12
            }
          ],
          languages: ['English', 'Italian'],
          location: 'New York, NY',
          timezone: 'EST',
          category: 'culinary',
          verificationStatus: {
            identity: true,
            credentials: true,
            background: true
          }
        };

        await setDoc(doc(db, 'experts', userCredential.user.uid), expertProfile);
        
        // Redirect to login page
        router.push('/login?message=Test account created successfully');
      } catch (error) {
        console.error('Error creating test account:', error);
      }
    };

    createAccount();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Creating Test Account</h1>
        <p className="text-gray-600 dark:text-gray-300">Please wait while we set up your test expert account...</p>
      </div>
    </div>
  );
};

export default CreateTestAccount;
