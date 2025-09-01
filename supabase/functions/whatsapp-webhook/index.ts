import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const verifyToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  // Handle webhook verification (GET request)
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    console.log('Webhook verification request:', { mode, token, challenge });

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('Webhook verified successfully');
      return new Response(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    } else {
      console.log('Webhook verification failed');
      return new Response('Verification failed', { status: 403 });
    }
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle webhook notifications (POST request)
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      console.log('Received WhatsApp webhook:', JSON.stringify(body, null, 2));

      // Process webhook data
      if (body.entry && body.entry[0] && body.entry[0].changes) {
        for (const change of body.entry[0].changes) {
          if (change.value && change.value.messages) {
            // Handle incoming messages
            for (const message of change.value.messages) {
              await processIncomingMessage(message, change.value);
            }
          }

          if (change.value && change.value.statuses) {
            // Handle message status updates
            for (const status of change.value.statuses) {
              await processMessageStatus(status);
            }
          }
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });

    } catch (error: any) {
      console.error('Error processing webhook:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 500,
          headers: { 
            'Content-Type': 'application/json', 
            ...corsHeaders 
          },
        }
      );
    }
  }

  return new Response('Method not allowed', { status: 405 });
};

async function processIncomingMessage(message: any, value: any) {
  try {
    console.log('Processing incoming message:', message);

    const messageRecord = {
      message_id: message.id,
      sender_phone: `+${message.from}`,
      recipient_phone: value.metadata?.display_phone_number || '',
      content: getMessageContent(message),
      status: 'received',
      message_type: message.type || 'text'
    };

    // Store in database
    const { error } = await supabase
      .from('whatsapp_messages')
      .upsert([messageRecord], { 
        onConflict: 'message_id',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Database error storing message:', error);
    } else {
      console.log('Message stored successfully');
    }

    // Auto-reply for certain messages (optional)
    await handleAutoReply(message);

  } catch (error) {
    console.error('Error processing incoming message:', error);
  }
}

async function processMessageStatus(status: any) {
  try {
    console.log('Processing message status:', status);

    const { error } = await supabase
      .from('whatsapp_messages')
      .update({ status: status.status })
      .eq('message_id', status.id);

    if (error) {
      console.error('Database error updating message status:', error);
    } else {
      console.log('Message status updated successfully');
    }
  } catch (error) {
    console.error('Error processing message status:', error);
  }
}

function getMessageContent(message: any): string {
  switch (message.type) {
    case 'text':
      return message.text?.body || '';
    case 'image':
      return `Image: ${message.image?.caption || 'No caption'}`;
    case 'document':
      return `Document: ${message.document?.filename || 'Unknown file'}`;
    case 'audio':
      return 'Audio message';
    case 'video':
      return `Video: ${message.video?.caption || 'No caption'}`;
    case 'location':
      return `Location: ${message.location?.latitude}, ${message.location?.longitude}`;
    case 'contacts':
      return `Contact: ${message.contacts?.[0]?.name?.formatted_name || 'Unknown contact'}`;
    default:
      return `${message.type} message`;
  }
}

async function handleAutoReply(message: any) {
  // Check if this is from a guest and if they need assistance
  const messageText = message.text?.body?.toLowerCase() || '';
  
  if (messageText.includes('help') || messageText.includes('support') || messageText.includes('portal')) {
    // Could send an auto-reply here if needed
    console.log('Received help request from:', message.from);
    
    // For now, just log it. In the future, we could:
    // 1. Check if sender is a current guest
    // 2. Send helpful auto-reply
    // 3. Notify admin of support request
  }
}

serve(handler);