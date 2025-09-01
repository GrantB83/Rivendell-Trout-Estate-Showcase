import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn } from 'lucide-react';

export const GuestAuth = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { signInWithPhone } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Format phone number (ensure it starts with +27)
    let formattedPhone = phone.replace(/\s+/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+27' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('+27')) {
      formattedPhone = '+27' + formattedPhone;
    }

    const { error } = await signInWithPhone(formattedPhone);
    
    if (error) {
      setError(error.message);
    } else {
      setMessage('Please check your phone for the verification code and follow the link.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Welcome to Rivendell
          </CardTitle>
          <p className="text-muted-foreground">
            Enter your mobile number to access your guest portal
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="083 123 4567"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter your mobile number as registered in your booking
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                'Sending verification...'
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Access Portal
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};