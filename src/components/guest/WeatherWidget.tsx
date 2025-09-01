import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Clock } from 'lucide-react';

interface WeatherData {
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }>;
  };
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      // Get weather city from app settings
      const { data: settings } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'weather_city')
        .single();

      if (!settings) {
        setError('Weather location not configured');
        setLoading(false);
        return;
      }

      // Call weather API through edge function
      const { data, error } = await supabase.functions.invoke('get-weather', {
        body: { city: settings.setting_value }
      });

      if (error) throw error;
      
      setWeather(data);
    } catch (err) {
      setError('Unable to load weather information');
      console.error('Weather error:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading weather...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">{error || 'Weather unavailable'}</div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <img 
              src={`https:${weather.current.condition.icon}`} 
              alt={weather.current.condition.text}
              className="w-12 h-12"
            />
            <div>
              <p className="text-3xl font-bold">{Math.round(weather.current.temp_c)}°C</p>
              <p className="text-sm text-muted-foreground">{weather.current.condition.text}</p>
            </div>
          </div>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span>Humidity: {weather.current.humidity}%</span>
            <span>Wind: {weather.current.wind_kph} km/h</span>
          </div>
        </div>

        {/* 3-Day Forecast */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">3-Day Forecast</h4>
          <div className="space-y-2">
            {weather.forecast.forecastday.slice(0, 3).map((day) => (
              <div key={day.date} className="flex items-center justify-between text-sm">
                <span className="w-16">{formatDate(day.date)}</span>
                <div className="flex items-center gap-2">
                  <img 
                    src={`https:${day.day.condition.icon}`} 
                    alt={day.day.condition.text}
                    className="w-6 h-6"
                  />
                  <span className="text-xs w-20 text-muted-foreground">{day.day.condition.text}</span>
                </div>
                <span className="font-medium">
                  {Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};