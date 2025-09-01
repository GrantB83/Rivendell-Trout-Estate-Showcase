import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, List, X } from 'lucide-react';

interface Activity {
  id: string;
  activity_name: string;
  description: string;
}

export const ActivityManager = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    activity_name: '',
    description: ''
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_suggestions')
        .select('*')
        .order('activity_name');

      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      setError('Error fetching activities: ' + (err as Error).message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        const { error } = await supabase
          .from('activity_suggestions')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        setSuccess('Activity updated successfully');
      } else {
        const { error } = await supabase
          .from('activity_suggestions')
          .insert([formData]);
        
        if (error) throw error;
        setSuccess('Activity added successfully');
      }

      setFormData({ activity_name: '', description: '' });
      setEditingId(null);
      fetchActivities();
    } catch (err) {
      setError('Error saving activity: ' + (err as Error).message);
    }
    setSaving(false);
  };

  const handleEdit = (activity: Activity) => {
    setFormData({
      activity_name: activity.activity_name,
      description: activity.description
    });
    setEditingId(activity.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      const { error } = await supabase
        .from('activity_suggestions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Activity deleted successfully');
      fetchActivities();
    } catch (err) {
      setError('Error deleting activity: ' + (err as Error).message);
    }
  };

  const handleCancel = () => {
    setFormData({ activity_name: '', description: '' });
    setEditingId(null);
  };

  if (loading) {
    return <div className="text-center">Loading activities...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {editingId ? 'Edit Activity' : 'Add New Activity'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activity_name">Activity Name</Label>
              <Input
                id="activity_name"
                value={formData.activity_name}
                onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
                placeholder="e.g., Fly Fishing on Spekboom River"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the activity, what to expect, costs, booking details, etc..."
                className="min-h-[100px]"
                required
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

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Activity' : 'Add Activity'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Activity Suggestions</h3>
        {activities.length === 0 ? (
          <p className="text-muted-foreground">No activities found.</p>
        ) : (
          <div className="grid gap-4">
            {activities.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <List className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">{activity.activity_name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(activity)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(activity.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};