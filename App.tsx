import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useUser } from './lib/auth';
import { AppProvider } from './store';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { PublicProfile } from './pages/PublicProfile';
import { YouTubeProfile } from './pages/YouTubeProfile';
import { NFC } from './pages/NFC';
import { Settings } from './pages/Settings';
import { CardView } from './pages/CardView';
import { Templates } from './pages/Templates';
import { EmailSignature } from './pages/EmailSignature';
import { Analytics } from './pages/Analytics';

// Private route wrapper using Supabase Auth
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useUser();
  return user ? <>{children}</> : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/preview" element={<PublicProfile />} />
      <Route path="/youtube-profile" element={<YouTubeProfile />} />
      <Route path="/c/:cardId" element={<CardView />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/editor" element={<PrivateRoute><Editor /></PrivateRoute>} />
      <Route path="/nfc" element={<PrivateRoute><NFC /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/templates" element={<PrivateRoute><Templates /></PrivateRoute>} />
      <Route path="/email-signature" element={<PrivateRoute><EmailSignature /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;