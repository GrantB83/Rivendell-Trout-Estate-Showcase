import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Settings, Phone, Send, TestTube } from 'lucide-react';

interface WhatsAppSettings {
  whatsapp_business_phone: string;
  whatsapp_access_token: string;
  whatsapp_verify_token: string;
  whatsapp_template_portal_link: string;
  whatsapp_template_service_request: string;
  whatsapp_template_otp: string;
}

export const WhatsAppSettings = () => {
  const [settings, setSettings] = useState<WhatsAppSettings>({
    whatsapp_business_phone: '',
    whatsapp_access_token: '',
    whatsapp_verify_token: '',
    whatsapp_template_portal_link: '',
    whatsapp_template_service_request: '',
    whatsapp_template_otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [testPhone, setTestPhone] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_key, setting_value')
        .in('setting_key', Object.keys(settings));

      if (error) throw error;

      const settingsMap = data?.reduce((acc, item) => {
        acc[item.setting_key as keyof WhatsAppSettings] = item.setting_value;
        return acc;
      }, {} as Partial<WhatsAppSettings>);

      setSettings(prev => ({ ...prev, ...settingsMap }));
    } catch (err) {
      setError('Error loading WhatsApp settings: ' + (err as Error).message);
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value
      }));

      const { error } = await supabase
        .from('app_settings')
        .upsert(updates, { onConflict: 'setting_key' });

      if (error) throw error;

      setMessage('WhatsApp settings saved successfully!');
    } catch (err) {
      setError('Error saving settings: ' + (err as Error).message);
    }
    setSaving(false);
  };

  const testWhatsAppConnection = async () => {
    if (!testPhone) {
      setError('Please enter a phone number to test');
      return;
    }

    setTesting(true);
    setError('');
    setMessage('');

    try {
      const { data, error } = await supabase.functions.invoke('send-whatsapp-message', {
        body: {
          to: testPhone,
          message: 'Test message from Rivendell Guest Management System. WhatsApp integration is working!'
        }
      });

      if (error) throw error;

      setMessage('Test message sent successfully!');
    } catch (err) {
      setError('Test failed: ' + (err as Error).message);
    }
    setTesting(false);
  };

  const handleInputChange = (key: keyof WhatsAppSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">Loading WhatsApp settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            WhatsApp Business API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business_phone">Business Phone Number</Label>
              <Input
                id="business_phone"
                value={settings.whatsapp_business_phone}
                onChange={(e) => handleInputChange('whatsapp_business_phone', e.target.value)}
                placeholder="+1234567890"
              />
              <p className="text-xs text-muted-foreground">
                Your WhatsApp Business phone number (with country code)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verify_token">Webhook Verify Token</Label>
              <Input
                id="verify_token"
                value={settings.whatsapp_verify_token}
                onChange={(e) => handleInputChange('whatsapp_verify_token', e.target.value)}
                placeholder="your-verify-token"
              />
              <p className="text-xs text-muted-foreground">
                Token used to verify webhook requests
              </p>
            </div>
          </div>

          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> You'll need to configure your WhatsApp Business API access token 
              in the Supabase Edge Functions secrets. The access token is not stored here for security reasons.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template_portal_link">Portal Link Template ID</Label>
              <Input
                id="template_portal_link"
                value={settings.whatsapp_template_portal_link}
                onChange={(e) => handleInputChange('whatsapp_template_portal_link', e.target.value)}
                placeholder="portal_link_template"
              />
              <p className="text-xs text-muted-foreground">
                Template ID for sending guest portal access links
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template_otp">OTP Template ID</Label>
              <Input
                id="template_otp"
                value={settings.whatsapp_template_otp}
                onChange={(e) => handleInputChange('whatsapp_template_otp', e.target.value)}
                placeholder="otp_verification_template"
              />
              <p className="text-xs text-muted-foreground">
                Template ID for sending OTP codes to guests
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template_service_request">Service Request Template ID</Label>
              <Input
                id="template_service_request"
                value={settings.whatsapp_template_service_request}
                onChange={(e) => handleInputChange('whatsapp_template_service_request', e.target.value)}
                placeholder="service_request_template"
              />
              <p className="text-xs text-muted-foreground">
                Template ID for service request notifications
              </p>
            </div>
          </div>

          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertDescription>
              Template IDs must be approved by Meta through WhatsApp Business Manager before use.
              Create templates for portal links, OTP codes, and service request notifications.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Test Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test WhatsApp Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="test_phone">Test Phone Number</Label>
              <Input
                id="test_phone"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={testWhatsAppConnection}
                disabled={testing || !testPhone}
                className="flex items-center gap-2"
              >
                {testing ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Test
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Send a test message to verify your WhatsApp Business API configuration
          </p>
        </CardContent>
      </Card>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Business Phone</span>
              <Badge variant={settings.whatsapp_business_phone ? 'default' : 'secondary'}>
                {settings.whatsapp_business_phone ? 'Configured' : 'Not Set'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Portal Link Template</span>
              <Badge variant={settings.whatsapp_template_portal_link ? 'default' : 'secondary'}>
                {settings.whatsapp_template_portal_link ? 'Configured' : 'Not Set'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">OTP Template</span>
              <Badge variant={settings.whatsapp_template_otp ? 'default' : 'secondary'}>
                {settings.whatsapp_template_otp ? 'Configured' : 'Not Set'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Service Request Template</span>
              <Badge variant={settings.whatsapp_template_service_request ? 'default' : 'secondary'}>
                {settings.whatsapp_template_service_request ? 'Configured' : 'Not Set'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

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

      <Button
        onClick={saveSettings}
        disabled={saving}
        className="w-full"
      >
        {saving ? 'Saving...' : 'Save WhatsApp Settings'}
      </Button>
    </div>
  );
};