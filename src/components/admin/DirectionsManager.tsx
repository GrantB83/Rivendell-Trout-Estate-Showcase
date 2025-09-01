import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Map } from 'lucide-react';

interface Direction {
  id: string;
  cottage_name: string;
  directions: string;
}

export const DirectionsManager = () => {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    cottage_name: '',
    directions: ''
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDirections();
  }, []);

  const fetchDirections = async () => {
    try {
      const { data, error } = await supabase
        .from('cottage_directions')
        .select('*')
        .order('cottage_name');

      if (error) throw error;
      setDirections(data || []);
    } catch (err) {
      setError('Error fetching directions: ' + (err as Error).message);
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
          .from('cottage_directions')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        setSuccess('Directions updated successfully');
      } else {
        const { error } = await supabase
          .from('cottage_directions')
          .insert([formData]);
        
        if (error) throw error;
        setSuccess('Directions added successfully');
      }

      setFormData({ cottage_name: '', directions: '' });
      setEditingId(null);
      fetchDirections();
    } catch (err) {
      setError('Error saving directions: ' + (err as Error).message);
    }
    setSaving(false);
  };

  const handleEdit = (direction: Direction) => {
    setFormData({
      cottage_name: direction.cottage_name,
      directions: direction.directions
    });
    setEditingId(direction.id);
  };

  const handleCancel = () => {
    setFormData({ cottage_name: '', directions: '' });
    setEditingId(null);
  };

  if (loading) {
    return <div className="text-center">Loading directions...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {editingId ? 'Edit Directions' : 'Add New Directions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cottage_name">Cottage Name</Label>
              <Input
                id="cottage_name"
                value={formData.cottage_name}
                onChange={(e) => setFormData({ ...formData, cottage_name: e.target.value })}
                placeholder="e.g., Hobbiton Cottage"
                required
                disabled={editingId !== null} // Don't allow changing cottage name when editing
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="directions">Driving Directions</Label>
              <Textarea
                id="directions"
                value={formData.directions}
                onChange={(e) => setFormData({ ...formData, directions: e.target.value })}
                placeholder="Enter detailed driving directions to this cottage..."
                className="min-h-[120px]"
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
                {saving ? 'Saving...' : editingId ? 'Update Directions' : 'Add Directions'}
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
        <h3 className="text-lg font-semibold">Cottage Directions</h3>
        {directions.length === 0 ? (
          <p className="text-muted-foreground">No directions found.</p>
        ) : (
          <div className="grid gap-4">
            {directions.map((direction) => (
              <Card key={direction.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Map className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">{direction.cottage_name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {direction.directions}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(direction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
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