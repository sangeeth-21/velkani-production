import React, { useState, useEffect } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { useLanguage } from '../context/LanguageContext';
import { User, Settings, ShoppingBag, HelpCircle, Info } from 'lucide-react';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { t } = useLanguage();
  const [userData, setUserData] = useState(null);
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = Cookies.get('userToken');
    const storedUserData = Cookies.get('userData');
    
    if (userToken && storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      } catch (err) {
        console.error('Error parsing user data:', err);
        fetchUserData(userToken);
      }
    } else if (userToken) {
      fetchUserData(userToken);
    } else {
      setShowPhonePopup(true);
    }
  }, []);

  const fetchUserData = async (uid) => {
    try {
      setLoading(true);
      const response = await fetch(`https://srivelkanistore.site/api/user.php?uid=${uid}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        const user = {
          uid: data.data.uid,
          name: data.data.name,
          number: data.data.number,
          createdAt: data.data.created_at,
          updatedAt: data.data.updated_at
        };
        
        setUserData(user);
        Cookies.set('userData', JSON.stringify(user), { expires: 30 });
      } else {
        Cookies.remove('userToken');
        setShowPhonePopup(true);
      }
    } catch (err) {
      setError('Failed to fetch user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`https://srivelkanistore.site/api/user.php?number=${phoneNumber}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        const user = {
          uid: data.data.uid,
          name: data.data.name,
          number: data.data.number,
          createdAt: data.data.created_at,
          updatedAt: data.data.updated_at
        };
        
        Cookies.set('userToken', user.uid, { expires: 30 });
        Cookies.set('userData', JSON.stringify(user), { expires: 30 });
        setUserData(user);
        setShowPhonePopup(false);
      } else {
        setShowNameInput(true);
      }
    } catch (err) {
      setError('Failed to verify phone number');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!name) {
      setError('Please enter your name');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('https://srivelkanistore.site/api/user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_user',
          name: name,
          number: phoneNumber
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        const newUser = {
          uid: data.data.uid,
          name: data.data.name,
          number: data.data.number,
          createdAt: data.data.created_at,
          updatedAt: data.data.updated_at
        };
        
        Cookies.set('userToken', newUser.uid, { expires: 30 });
        Cookies.set('userData', JSON.stringify(newUser), { expires: 30 });
        
        setUserData(newUser);
        setShowPhonePopup(false);
        setShowNameInput(false);
      } else {
        setError(data.message || 'Failed to create user');
      }
    } catch (err) {
      setError('Failed to create user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('userToken');
    Cookies.remove('userData');
    setUserData(null);
    setShowPhonePopup(true);
    setPhoneNumber('');
    setName('');
    setShowNameInput(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <GlobalLanguageSwitcher />
        <CartButton />
      </div>
      
      <main className="flex-1 pt-6 pb-16 content-container">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">Loading...</div>
          </div>
        )}
        
        {showPhonePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg shadow-sm p-6 w-full max-w-md animate-fade-in">
              <h2 className="text-lg font-medium mb-4">{t('Login')}</h2>
              
              {!showNameInput ? (
                <>
                  <p className="text-muted-foreground mb-4">{t('Phone_Number')}</p>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={t('phone_Phoe Number')}
                    className="w-full p-3 border rounded mb-4"
                  />
                  {error && <p className="text-red-500 mb-4">{error}</p>}
                  <button
                    onClick={handlePhoneSubmit}
                    className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition-colors"
                    disabled={loading}
                  >
                    {loading ? t('loading') : t('continue')}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-4">{t('Name')}</p>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('name_Full Name')}
                    className="w-full p-3 border rounded mb-4"
                  />
                  {error && <p className="text-red-500 mb-4">{error}</p>}
                  <button
                    onClick={handleCreateUser}
                    className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition-colors"
                    disabled={loading}
                  >
                    {loading ? t('loading') : t('create_account')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        
        {userData ? (
          <>
            <h1 className="text-xl font-medium mb-4">{t('profile_Profile')}</h1>
            
            <div className="bg-card rounded-lg shadow-sm p-4 mb-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-4 mr-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-medium">{userData.name}</h2>
                    <p className="text-sm text-muted-foreground">{userData.number}</p>
                    <p className="text-xs text-muted-foreground mt-1">UID: {userData.uid}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  {t('logout')}
                </button>
              </div>
            </div>
            
            <div className="space-y-2 animate-fade-in">
              <div className="bg-card rounded-lg shadow-sm">
                
                <button 
                  className="w-full flex items-center p-4 hover:bg-secondary/50 transition-colors border-t"
                  onClick={() => navigate('/orders')}
                >
                  <ShoppingBag className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>{t('profile_orders')}</span>
                </button>
              </div>
              
              <div className="bg-card rounded-lg shadow-sm">
                <button 
                  className="w-full flex items-center p-4 hover:bg-secondary/50 transition-colors"
                  onClick={() => navigate('/help')}
                >
                  <HelpCircle className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>{t('profile_help')}</span>
                </button>
                
                <button 
                  className="w-full flex items-center p-4 hover:bg-secondary/50 transition-colors border-t"
                  onClick={() => navigate('/about')}
                >
                  <Info className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span>{t('profile_about')}</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          !showPhonePopup && (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-muted-foreground mb-4">{t('profile_loading')}</p>
            </div>
          )
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;