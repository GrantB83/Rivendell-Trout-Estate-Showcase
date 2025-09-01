import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Clock, CheckCircle, List } from 'lucide-react';

interface ServiceRequest {
  id: string;
  request_type: string;
  notes: string;
  status: string;
  created_at: string;
}

interface ServiceRequestFormProps {
  guestId: string;
}

export const ServiceRequestForm = ({ guestId }: ServiceRequestFormProps) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [requestType, setRequestType] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [guestId]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('guest_id', guestId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      setError('Error loading your requests: ' + (err as Error).message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert([{
          guest_id: guestId,
          request_type: requestType as 'firewood' | 'braai_pack' | 'breakfast_basket' | 'cleaning' | 'other',
          notes: notes || null,
          status: 'pending' as 'pending'
        }]);

      if (error) throw error;

      // Send notification email via edge function
      await supabase.functions.invoke('send-service-notification', {
        body: {
          guest_id: guestId,
          request_type: requestType,
          notes: notes
        }
      });

      setSuccess(`Your ${requestType.replace('_', ' ')} request has been received and will be processed shortly.`);
      setRequestType('');
      setNotes('');
      fetchRequests();
    } catch (err) {
      setError('Error submitting request: ' + (err as Error).message);
    }
    setSubmitting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'in_progress': return 'secondary';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'delivered': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* New Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Request Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="request_type">Service Type</Label>
              <Select value={requestType} onValueChange={setRequestType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="firewood">Firewood Delivery</SelectItem>
                  <SelectItem value="braai_pack">Braai Pack</SelectItem>
                  <SelectItem value="breakfast_basket">Breakfast Basket</SelectItem>
                  <SelectItem value="cleaning">Cleaning Service</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or instructions..."
                className="min-h-[80px]"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={!requestType || submitting} className="w-full">
              {submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Previous Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Your Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground">Loading your requests...</div>
          ) : requests.length === 0 ? (
            <div className="text-center text-muted-foreground">No requests yet.</div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">
                        {request.request_type.replace('_', ' ')}
                      </span>
                      <Badge variant={getStatusColor(request.status)} className="flex items-center gap-1">
                        {getStatusIcon(request.status)}
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    {request.notes && (
                      <p className="text-sm text-muted-foreground">{request.notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};