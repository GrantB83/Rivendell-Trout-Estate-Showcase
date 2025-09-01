import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { List } from 'lucide-react';

interface Activity {
  id: string;
  activity_name: string;
  description: string;
}

export const ActivityList = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Error fetching activities:', err);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Things to Do
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="text-center text-muted-foreground">No activities available at the moment.</div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="border-l-4 border-primary pl-4 space-y-1">
                <h4 className="font-semibold text-primary">{activity.activity_name}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};