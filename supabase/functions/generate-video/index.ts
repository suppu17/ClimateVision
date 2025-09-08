import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()

    // Get FAL API key from Supabase secrets
    const FAL_API_KEY = Deno.env.get('FAL_API_KEY')
    if (!FAL_API_KEY) {
      throw new Error('FAL API key not configured')
    }

    // Generate video using FAL AI
    const response = await fetch('https://fal.run/fal-ai/stable-video-diffusion', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        motion_bucket_id: 180,
        cond_aug: 0.02,
        steps: 25,
        fps: 6
      }),
    })

    if (!response.ok) {
      throw new Error(`FAL API error: ${response.statusText}`)
    }

    const result = await response.json()
    
    return new Response(
      JSON.stringify({ videoUrl: result.video.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})