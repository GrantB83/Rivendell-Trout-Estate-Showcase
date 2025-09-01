import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Calendar } from 'lucide-react';

interface GateCode {
  id: string;
  cottage_name: string;
  code: string;
  start_date: string;
  end_date: string;
}

export const GateCodeManager = () => {
  const [codes, setCodes] = useState<GateCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    cottage_name: '',
    code: '',
    start_date: '',
    end_date: ''
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('gate_codes')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setCodes(data || []);
    } catch (err) {
      setError('Error fetching gate codes: ' + (err as Error).message);
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
          .from('gate_codes')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        setSuccess('Gate code updated successfully');
      } else {
        const { error } = await supabase
          .from('gate_codes')
          .insert([formData]);
        
        if (error) throw error;
        setSuccess('Gate code added successfully');
      }

      setFormData({ cottage_name: '', code: '', start_date: '', end_date: '' });
      setEditingId(null);
      fetchCodes();
    } catch (err) {
      setError('Error saving gate code: ' + (err as Error).message);
    }
    setSaving(false);
  };

  const handleEdit = (code: GateCode) => {
    setFormData({
      cottage_name: code.cottage_name,
      code: code.code,
      start_date: code.start_date,
      end_date: code.end_date
    });
    setEditingId(code.id);
  };

  const handleCancel = () => {
    setFormData({ cottage_name: '', code: '', start_date: '', end_date: '' });
    setEditingId(null);
  };

  if (loading) {
    return <div className="text-center">Loading gate codes...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {editingId ? 'Edit Gate Code' : 'Add New Gate Code'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cottage_name">Cottage Name</Label>
                <Input
                  id="cottage_name"
                  value={formData.cottage_name}
                  onChange={(e) => setFormData({ ...formData, cottage_name: e.target.value })}
                  placeholder="e.g., Hobbiton Cottage"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">Gate Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., 1234"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
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
                {saving ? 'Saving...' : editingId ? 'Update Code' : 'Add Code'}
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
        <h3 className="text-lg font-semibold">Current Gate Codes</h3>
        {codes.length === 0 ? (
          <p className="text-muted-foreground">No gate codes found.</p>
        ) : (
          <div className="grid gap-4">
            {codes.map((code) => (
              <Card key={code.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{code.cottage_name}</h4>
                      <p className="text-2xl font-mono font-bold text-primary">{code.code}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {code.start_date} to {code.end_date}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(code)}
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