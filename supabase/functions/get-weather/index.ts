import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city } = await req.json();
    
    if (!city) {
      throw new Error('City parameter is required');
    }

    // Using WeatherAPI.com (free tier allows 1M calls/month)
    // You'll need to get an API key from https://www.weatherapi.com/
    const apiKey = Deno.env.get('WEATHER_API_KEY');
    
    if (!apiKey) {
      // Return mock data if no API key is configured
      const mockData = {
        current: {
          temp_c: 22,
          condition: {
            text: "Partly cloudy",
            icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
          },
          humidity: 65,
          wind_kph: 12
        },
        forecast: {
          forecastday: [
            {
              date: new Date().toISOString().split('T')[0],
              day: {
                maxtemp_c: 25,
                mintemp_c: 15,
                condition: {
                  text: "Partly cloudy",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
                }
              }
            },
            {
              date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              day: {
                maxtemp_c: 27,
                mintemp_c: 16,
                condition: {
                  text: "Sunny",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
                }
              }
            },
            {
              date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
              day: {
                maxtemp_c: 24,
                mintemp_c: 14,
                condition: {
                  text: "Light rain",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/296.png"
                }
              }
            }
          ]
        }
      };
      
      return new Response(JSON.stringify(mockData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=3&aqi=no`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const weatherData = await response.json();

    return new Response(JSON.stringify(weatherData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-weather function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});