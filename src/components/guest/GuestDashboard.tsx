import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { WeatherWidget } from '@/components/guest/WeatherWidget';
import { ServiceRequestForm } from '@/components/guest/ServiceRequestForm';
import { ActivityList } from '@/components/guest/ActivityList';
import { LogOut, Map, Calendar, Info } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  surname: string;
  booking_number: string;
  cottage_name: string;
  contact_number: string;
  check_in_date: string;
  check_out_date: string;
}

interface GateCode {
  code: string;
  cottage_name: string;
}

interface Directions {
  directions: string;
}

interface GuestDashboardProps {
  guest: Guest;
}

export const GuestDashboard = ({ guest }: GuestDashboardProps) => {
  const { signOut } = useAuth();
  const [gateCode, setGateCode] = useState<string>('');
  const [directions, setDirections] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGuestData();
  }, [guest]);

  const fetchGuestData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Fetch current gate code
      const { data: codeData } = await supabase
        .from('gate_codes')
        .select('code')
        .eq('cottage_name', guest.cottage_name)
        .lte('start_date', today)
        .gte('end_date', today)
        .single();

      if (codeData) {
        setGateCode(codeData.code);
      }

      // Fetch cottage directions
      const { data: directionsData } = await supabase
        .from('cottage_directions')
        .select('directions')
        .eq('cottage_name', guest.cottage_name)
        .single();

      if (directionsData) {
        setDirections(directionsData.directions);
      }
    } catch (err) {
      setError('Error loading your information: ' + (err as Error).message);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">Loading your information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Welcome, {guest.name}!
            </h1>
            <p className="text-sm text-muted-foreground">
              {guest.cottage_name} • {formatDate(guest.check_in_date)} - {formatDate(guest.check_out_date)}
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Welcome and Essential Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Your Stay Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Cottage</p>
                <p className="font-semibold">{guest.cottage_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Booking Number</p>
                <p className="font-mono">{guest.booking_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Gate Code</p>
                <p className="text-2xl font-mono font-bold text-primary">
                  {gateCode || 'No active code'}
                </p>
              </div>
            </CardContent>
          </Card>

          <WeatherWidget />
        </div>

        {/* Directions */}
        {directions && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Driving Directions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {directions}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Service Requests */}
        <ServiceRequestForm guestId={guest.id} />

        {/* Activities */}
        <ActivityList />
      </main>
    </div>
  );
};