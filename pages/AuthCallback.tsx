import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/database';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        // Supabase will automatically handle the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/auth');
          return;
        }

        if (session) {
          // Redirect to dashboard after successful authentication
          navigate('/dashboard');
        } else {
          // No session found, redirect to auth
          navigate('/auth');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-zinc-600">Completing sign in...</p>
      </div>
    </div>
  );
};
