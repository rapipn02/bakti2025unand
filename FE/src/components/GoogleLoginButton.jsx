import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import toast from 'react-hot-toast';

const GoogleLoginButton = ({ onSuccess, onError, disabled = false }) => {
  const googleButtonRef = useRef(null);
  const { googleLogin, loading } = useAuth();

  const handleCredentialResponse = useCallback(async (response) => {
    try {
      // Decode the JWT token to get user info
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));
      
      const userData = {
        name: payload.name,
        email: payload.email,
        password: `google_${payload.sub}`, // Use Google ID as password
        image: payload.picture || ''
      };

      // Call the Google login API
      const result = await googleLogin(userData);
      
      if (result.success) {
        if (onSuccess) {
          onSuccess(result.data); // Kirim data user termasuk role
        }
      } else {
        if (onError) {
          onError(result.error);
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed');
      if (onError) {
        onError(error.message);
      }
    }
  }, [googleLogin, onSuccess, onError]);

  useEffect(() => {
    // Load Google Identity Services
    const initializeGoogleSignIn = async () => {
      try {
        // Load the Google Identity Services script
        if (!window.google) {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        // Wait for Google to be available
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          // Render the button
          if (googleButtonRef.current) {
            window.google.accounts.id.renderButton(
              googleButtonRef.current,
              {
                theme: 'outline',
                size: 'large',
                width: '100%',
                text: 'continue_with',
                shape: 'rectangular'
              }
            );
          }
        }
      } catch (error) {
        console.error('Failed to initialize Google Sign-In:', error);
        toast.error('Failed to load Google Sign-In');
      }
    };

    initializeGoogleSignIn();
  }, [handleCredentialResponse]);

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID") {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => toast.info('Google Login akan segera tersedia!\n\nUntuk mengaktifkan:\n1. Dapatkan Google Client ID\n2. Tambahkan ke .env sebagai VITE_GOOGLE_CLIENT_ID\n3. Restart aplikasi')}
          disabled={disabled || loading}
          className={`relative w-full border border-[#623B1C] py-3 rounded-xl flex items-center justify-center transition ${
            disabled || loading 
              ? 'bg-gray-100 cursor-not-allowed' 
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          <img
            src="/src/assets/Login/Google.svg"
            alt="Google"
            className="h-5 w-5 absolute left-4"
          />
          <span className="text-[#603813] font-semibold">
            Lanjutkan dengan Google (Demo)
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Google Identity Services button will be rendered here */}
      <div ref={googleButtonRef} className="w-full min-h-[48px]"></div>
    </div>
  );
};

export default GoogleLoginButton;
