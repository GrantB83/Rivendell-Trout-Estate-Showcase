import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GuestAuth } from '@/components/guest/GuestAuth';
import { GuestDashboard } from '@/components/guest/GuestDashboard';

const GuestPortal = () => {
  const { guest, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!guest) {
    return <GuestAuth />;
  }

  return <GuestDashboard guest={guest} />;
};

export default GuestPortal;