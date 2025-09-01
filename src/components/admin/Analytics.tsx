import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calendar, Clock, List } from 'lucide-react';

interface AnalyticsData {
  totalGuests: number;
  currentGuests: number;
  totalServiceRequests: number;
  pendingRequests: number;
  requestsByType: Record<string, number>;
}

export const Analytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalGuests: 0,
    currentGuests: 0,
    totalServiceRequests: 0,
    pendingRequests: 0,
    requestsByType: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get total guests
      const { count: totalGuests } = await supabase
        .from('guests')
        .select('*', { count: 'exact', head: true });

      // Get current guests (checked in)
      const { count: currentGuests } = await supabase
        .from('guests')
        .select('*', { count: 'exact', head: true })
        .lte('check_in_date', today)
        .gte('check_out_date', today);

      // Get total service requests
      const { count: totalServiceRequests } = await supabase
        .from('service_requests')
        .select('*', { count: 'exact', head: true });

      // Get pending requests
      const { count: pendingRequests } = await supabase
        .from('service_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get requests by type
      const { data: requestsData } = await supabase
        .from('service_requests')
        .select('request_type');

      const requestsByType: Record<string, number> = {};
      requestsData?.forEach((req) => {
        const type = req.request_type;
        requestsByType[type] = (requestsByType[type] || 0) + 1;
      });

      setData({
        totalGuests: totalGuests || 0,
        currentGuests: currentGuests || 0,
        totalServiceRequests: totalServiceRequests || 0,
        pendingRequests: pendingRequests || 0,
        requestsByType
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Guests</p>
                <p className="text-2xl font-bold">{data.totalGuests}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Guests</p>
                <p className="text-2xl font-bold">{data.currentGuests}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{data.totalServiceRequests}</p>
              </div>
              <List className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{data.pendingRequests}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Requests by Type</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(data.requestsByType).length === 0 ? (
            <p className="text-muted-foreground">No service requests yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.requestsByType).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="capitalize">{type.replace('_', ' ')}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};