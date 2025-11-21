import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/database';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        setStatus('Verifying authentication...');
        
        // First, check if we have hash params (OAuth response)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          setStatus('Setting up your session...');
          // Wait a bit for Supabase to process the session
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('Authentication failed. Redirecting...');
          setTimeout(() => navigate('/auth'), 1500);
          return;
        }

        if (session) {
          setStatus('Success! Redirecting to dashboard...');
          // Small delay to show success message
          setTimeout(() => navigate('/dashboard'), 500);
        } else {
          setStatus('No session found. Redirecting...');
          setTimeout(() => navigate('/auth'), 1500);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('Error occurred. Redirecting...');
        setTimeout(() => navigate('/auth'), 1500);
      }
    };

    handleCallback();
  }, [navigate]);

  return <LoadingSpinner fullScreen text={status} />;
};
