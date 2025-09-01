import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { guest_id, request_type, notes } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get guest details
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guest_id)
      .single();

    if (guestError || !guest) {
      throw new Error('Guest not found');
    }

    // Log the service request notification (since we don't have email configured yet)
    console.log('Service Request Notification:', {
      guest: `${guest.name} ${guest.surname}`,
      cottage: guest.cottage_name,
      booking: guest.booking_number,
      contact: guest.contact_number,
      request_type: request_type.replace('_', ' '),
      notes: notes || 'No additional notes',
      timestamp: new Date().toISOString()
    });

    // In a real implementation, you would send an email here using Resend or similar
    // For now, we'll just return success
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification logged successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-service-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});