import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import toast from 'react-hot-toast';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get authorization code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          toast.error('Google authentication failed');
          navigate('/login');
          return;
        }

        if (code) {
          // Exchange code for user info (this would typically be done on backend)
          toast.loading('Processing Google login...');
          
          // For demo purposes, redirect to login
          toast.dismiss();
          toast.info('Google login callback received. This feature requires backend integration.');
          navigate('/login');
        } else {
          toast.error('No authorization code received');
          navigate('/login');
        }
      } catch (error) {
        console.error('Google callback error:', error);
        toast.error('Failed to process Google login');
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, googleLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefaf1]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8D6E63] mx-auto"></div>
        <p className="mt-4 text-[#603813] font-semibold">
          Processing Google authentication...
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;
