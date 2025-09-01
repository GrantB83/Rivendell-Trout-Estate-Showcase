import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const whatsappAccessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface WhatsAppMessageRequest {
  to: string;
  message?: string;
  template?: {
    name: string;
    language: string;
    components?: any[];
  };
  media?: {
    type: 'image' | 'document' | 'video';
    url: string;
    caption?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!whatsappAccessToken) {
      throw new Error('WhatsApp Access Token not configured');
    }

    const { to, message, template, media }: WhatsAppMessageRequest = await req.json();

    if (!to) {
      throw new Error('Recipient phone number is required');
    }

    // Get WhatsApp Business Phone Number ID from settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_key', 'whatsapp_business_phone')
      .single();

    if (settingsError || !settingsData?.setting_value) {
      throw new Error('WhatsApp Business Phone not configured');
    }

    const phoneNumberId = settingsData.setting_value.replace('+', '').replace(/\s/g, '');

    // Prepare message payload
    let messagePayload: any = {
      messaging_product: 'whatsapp',
      to: to.replace('+', ''),
      type: 'text'
    };

    if (template) {
      messagePayload = {
        ...messagePayload,
        type: 'template',
        template: {
          name: template.name,
          language: { code: template.language || 'en' },
          components: template.components || []
        }
      };
    } else if (media) {
      messagePayload = {
        ...messagePayload,
        type: media.type,
        [media.type]: {
          link: media.url,
          caption: media.caption || ''
        }
      };
    } else if (message) {
      messagePayload = {
        ...messagePayload,
        text: { body: message }
      };
    } else {
      throw new Error('Either message, template, or media must be provided');
    }

    console.log('Sending WhatsApp message:', JSON.stringify(messagePayload, null, 2));

    // Send message via WhatsApp Business API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('WhatsApp API error:', responseData);
      throw new Error(`WhatsApp API error: ${responseData.error?.message || 'Unknown error'}`);
    }

    console.log('WhatsApp message sent successfully:', responseData);

    // Store message in database
    const messageRecord = {
      message_id: responseData.messages?.[0]?.id || `temp_${Date.now()}`,
      sender_phone: settingsData.setting_value,
      recipient_phone: to,
      content: message || `Template: ${template?.name}` || `Media: ${media?.type}`,
      status: 'sent',
      message_type: template ? 'template' : media ? 'media' : 'text'
    };

    const { error: dbError } = await supabase
      .from('whatsapp_messages')
      .insert([messageRecord]);

    if (dbError) {
      console.error('Database error:', dbError);
      // Don't throw here, message was sent successfully
    }

    return new Response(JSON.stringify({
      success: true,
      message_id: responseData.messages?.[0]?.id,
      data: responseData
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in send-whatsapp-message function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);