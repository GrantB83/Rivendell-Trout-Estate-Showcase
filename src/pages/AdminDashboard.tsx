import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminAuth } from '@/components/admin/AdminAuth';
import { EnhancedGuestImport } from '@/components/admin/EnhancedGuestImport';
import { GuestManagement } from '@/components/admin/GuestManagement';
import { GateCodeManager } from '@/components/admin/GateCodeManager';
import { DirectionsManager } from '@/components/admin/DirectionsManager';
import { ActivityManager } from '@/components/admin/ActivityManager';
import { WhatsAppSettings } from '@/components/admin/WhatsAppSettings';
import { Analytics } from '@/components/admin/Analytics';
import { LogOut, Database, Settings, Users, Calendar, Map, List } from 'lucide-react';

const AdminDashboard = () => {
  const { profile, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return <AdminAuth />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Rivendell Admin Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="import" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Import
            </TabsTrigger>
            <TabsTrigger value="guests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Guests
            </TabsTrigger>
            <TabsTrigger value="codes" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Gate Codes
            </TabsTrigger>
            <TabsTrigger value="directions" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Directions
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Import Guest Data</CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedGuestImport />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guests">
            <GuestManagement />
          </TabsContent>

          <TabsContent value="codes">
            <Card>
              <CardHeader>
                <CardTitle>Manage Gate Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <GateCodeManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="directions">
            <Card>
              <CardHeader>
                <CardTitle>Manage Cottage Directions</CardTitle>
              </CardHeader>
              <CardContent>
                <DirectionsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Manage Activity Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Analytics />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <WhatsAppSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;