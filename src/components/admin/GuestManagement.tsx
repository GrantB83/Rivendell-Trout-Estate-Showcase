import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, Users, Phone, MapPin, Calendar, DollarSign, Mail, 
  Shield, ShieldOff, Eye, Edit, MessageSquare, Download 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GuestIdentity {
  id: string;
  contact_number: string;
  email: string | null;
  primary_name: string;
  primary_surname: string;
  first_booking_date: string;
  last_booking_date: string;
  total_bookings: number;
  total_spent: number;
  preferred_cottage: string | null;
  marketing_consent: boolean;
  marketing_excluded: boolean;
  exclusion_reason: string | null;
  communication_preferences: any;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Guest {
  id: string;
  name: string;
  surname: string;
  booking_number: string;
  cottage_name: string;
  contact_number: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number | null;
  marketing_consent: boolean;
  created_at: string;
}

interface ExclusionReason {
  id: string;
  reason_code: string;
  reason_description: string;
}

export const GuestManagement = () => {
  const [guestIdentities, setGuestIdentities] = useState<GuestIdentity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'excluded'>('all');
  const [selectedGuest, setSelectedGuest] = useState<GuestIdentity | null>(null);
  const [guestBookings, setGuestBookings] = useState<Guest[]>([]);
  const [exclusionReasons, setExclusionReasons] = useState<ExclusionReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExclusionReason, setSelectedExclusionReason] = useState('');
  const [exclusionNotes, setExclusionNotes] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadGuestIdentities();
    loadExclusionReasons();
  }, []);

  const loadGuestIdentities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('guest_identities')
        .select('*')
        .order('last_booking_date', { ascending: false });

      if (error) throw error;
      setGuestIdentities(data || []);
    } catch (error) {
      console.error('Error loading guest identities:', error);
      toast({
        title: "Error loading guests",
        description: "Failed to load guest data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadExclusionReasons = async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_exclusion_reasons')
        .select('*')
        .eq('is_active', true)
        .order('reason_description');

      if (error) throw error;
      setExclusionReasons(data || []);
    } catch (error) {
      console.error('Error loading exclusion reasons:', error);
    }
  };

  const loadGuestBookings = async (guestId: string) => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('guest_identity_id', guestId)
        .order('check_in_date', { ascending: false });

      if (error) throw error;
      setGuestBookings(data || []);
    } catch (error) {
      console.error('Error loading guest bookings:', error);
    }
  };

  const updateMarketingStatus = async (guestId: string, excluded: boolean, reason?: string, notes?: string) => {
    try {
      const { error } = await supabase.rpc('update_marketing_exclusion', {
        guest_identity_id: guestId,
        excluded: excluded,
        reason: reason || null,
        notes: notes || null,
      });

      if (error) throw error;

      // Refresh guest data
      await loadGuestIdentities();
      
      // Update selected guest if it's the one we modified
      if (selectedGuest?.id === guestId) {
        const updatedGuest = guestIdentities.find(g => g.id === guestId);
        if (updatedGuest) {
          setSelectedGuest({
            ...updatedGuest,
            marketing_excluded: excluded,
            exclusion_reason: excluded ? reason || null : null,
          });
        }
      }

      toast({
        title: excluded ? "Guest excluded from marketing" : "Guest included in marketing",
        description: excluded 
          ? `${selectedGuest?.primary_name} has been excluded from marketing communications.`
          : `${selectedGuest?.primary_name} has been included in marketing communications.`,
      });

      setSelectedExclusionReason('');
      setExclusionNotes('');
    } catch (error) {
      console.error('Error updating marketing status:', error);
      toast({
        title: "Error updating marketing status",
        description: "Failed to update marketing preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredGuests = guestIdentities.filter(guest => {
    const matchesSearch = searchTerm === '' || 
      guest.primary_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.primary_surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.contact_number.includes(searchTerm) ||
      (guest.email && guest.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'active' && !guest.marketing_excluded) ||
      (filterStatus === 'excluded' && guest.marketing_excluded);

    return matchesSearch && matchesFilter;
  });

  const exportGuestData = async () => {
    try {
      const csvContent = [
        ['Name', 'Surname', 'Phone', 'Email', 'Total Bookings', 'Total Spent', 'Last Booking', 'Marketing Status'].join(','),
        ...filteredGuests.map(guest => [
          guest.primary_name,
          guest.primary_surname,
          guest.contact_number,
          guest.email || '',
          guest.total_bookings,
          guest.total_spent,
          guest.last_booking_date,
          guest.marketing_excluded ? 'Excluded' : 'Active',
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `guest-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: `Exported ${filteredGuests.length} guest records.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export guest data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA');
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading guest data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Guest Management</span>
            </div>
            <Button onClick={exportGuestData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Guests</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Filter by Status</Label>
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Guests</SelectItem>
                  <SelectItem value="active">Marketing Active</SelectItem>
                  <SelectItem value="excluded">Marketing Excluded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guest List */}
      <div className="grid gap-4">
        {filteredGuests.map((guest) => (
          <Card key={guest.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">
                        {guest.primary_name} {guest.primary_surname}
                      </h3>
                      {guest.marketing_excluded ? (
                        <Badge variant="destructive" className="flex items-center space-x-1">
                          <ShieldOff className="h-3 w-3" />
                          <span>Excluded</span>
                        </Badge>
                      ) : (
                        <Badge variant="default" className="flex items-center space-x-1">
                          <Shield className="h-3 w-3" />
                          <span>Active</span>
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{guest.contact_number}</span>
                      </div>
                      {guest.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{guest.email}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{guest.total_bookings} bookings</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(guest.total_spent)}</span>
                      </div>
                    </div>

                    {guest.preferred_cottage && (
                      <div className="flex items-center space-x-1 mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>Prefers: {guest.preferred_cottage}</span>
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground mt-1">
                      Last booking: {formatDate(guest.last_booking_date)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedGuest(guest);
                          loadGuestBookings(guest.id);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Users className="h-5 w-5" />
                          <span>{selectedGuest?.primary_name} {selectedGuest?.primary_surname}</span>
                          {selectedGuest?.marketing_excluded ? (
                            <Badge variant="destructive">Marketing Excluded</Badge>
                          ) : (
                            <Badge variant="default">Marketing Active</Badge>
                          )}
                        </DialogTitle>
                      </DialogHeader>

                      {selectedGuest && (
                        <div className="space-y-6">
                          {/* Guest Information */}
                          <Card>
                            <CardHeader>
                              <CardTitle>Guest Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Contact Number</Label>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{selectedGuest.contact_number}</span>
                                  </div>
                                </div>
                                {selectedGuest.email && (
                                  <div>
                                    <Label>Email</Label>
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4" />
                                      <span>{selectedGuest.email}</span>
                                    </div>
                                  </div>
                                )}
                                <div>
                                  <Label>Total Bookings</Label>
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{selectedGuest.total_bookings}</span>
                                  </div>
                                </div>
                                <div>
                                  <Label>Total Spent</Label>
                                  <div className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4" />
                                    <span>{formatCurrency(selectedGuest.total_spent)}</span>
                                  </div>
                                </div>
                                <div>
                                  <Label>First Booking</Label>
                                  <span>{formatDate(selectedGuest.first_booking_date)}</span>
                                </div>
                                <div>
                                  <Label>Last Booking</Label>
                                  <span>{formatDate(selectedGuest.last_booking_date)}</span>
                                </div>
                              </div>

                              {selectedGuest.preferred_cottage && (
                                <div>
                                  <Label>Preferred Cottage</Label>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{selectedGuest.preferred_cottage}</span>
                                  </div>
                                </div>
                              )}

                              {selectedGuest.notes && (
                                <div>
                                  <Label>Notes</Label>
                                  <p className="text-sm text-muted-foreground">{selectedGuest.notes}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* Marketing Status */}
                          <Card>
                            <CardHeader>
                              <CardTitle>Marketing Preferences</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Label>Marketing Status</Label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedGuest.marketing_excluded 
                                      ? `Excluded from marketing (${selectedGuest.exclusion_reason})`
                                      : 'Active in marketing communications'
                                    }
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {selectedGuest.marketing_excluded ? (
                                    <Button
                                      onClick={() => updateMarketingStatus(selectedGuest.id, false)}
                                      variant="outline"
                                      size="sm"
                                    >
                                      <Shield className="h-4 w-4 mr-1" />
                                      Include in Marketing
                                    </Button>
                                  ) : (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          <ShieldOff className="h-4 w-4 mr-1" />
                                          Exclude from Marketing
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Exclude from Marketing</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <div>
                                            <Label>Reason for Exclusion</Label>
                                            <Select value={selectedExclusionReason} onValueChange={setSelectedExclusionReason}>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select a reason..." />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {exclusionReasons.map((reason) => (
                                                  <SelectItem key={reason.id} value={reason.reason_code}>
                                                    {reason.reason_description}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div>
                                            <Label>Additional Notes (Optional)</Label>
                                            <Textarea
                                              value={exclusionNotes}
                                              onChange={(e) => setExclusionNotes(e.target.value)}
                                              placeholder="Add any additional context..."
                                            />
                                          </div>
                                          <Button
                                            onClick={() => {
                                              if (selectedExclusionReason) {
                                                updateMarketingStatus(
                                                  selectedGuest.id, 
                                                  true, 
                                                  selectedExclusionReason, 
                                                  exclusionNotes
                                                );
                                              }
                                            }}
                                            disabled={!selectedExclusionReason}
                                            className="w-full"
                                          >
                                            Exclude from Marketing
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </div>
                              </div>

                              <div>
                                <Label>Communication Preferences</Label>
                                <div className="flex space-x-4 mt-2">
                                  <Badge variant={selectedGuest.communication_preferences?.email ? "default" : "secondary"}>
                                    Email: {selectedGuest.communication_preferences?.email ? 'Yes' : 'No'}
                                  </Badge>
                                  <Badge variant={selectedGuest.communication_preferences?.sms ? "default" : "secondary"}>
                                    SMS: {selectedGuest.communication_preferences?.sms ? 'Yes' : 'No'}
                                  </Badge>
                                  <Badge variant={selectedGuest.communication_preferences?.whatsapp ? "default" : "secondary"}>
                                    WhatsApp: {selectedGuest.communication_preferences?.whatsapp ? 'Yes' : 'No'}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Booking History */}
                          <Card>
                            <CardHeader>
                              <CardTitle>Booking History</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {guestBookings.map((booking) => (
                                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                      <div className="font-medium">{booking.cottage_name}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        Booking: {booking.booking_number}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      {booking.total_amount && (
                                        <div className="font-medium">{formatCurrency(booking.total_amount)}</div>
                                      )}
                                      <div className="text-sm text-muted-foreground">
                                        {formatDate(booking.created_at)}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGuests.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No guests found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search criteria.' : 'No guest data available.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};