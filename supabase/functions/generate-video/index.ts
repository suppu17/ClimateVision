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
    const { imageData, prompt } = await req.json()

    if (!imageData || !prompt) {
      throw new Error('Missing imageData or prompt')
    }

    // Get FAL API key from Supabase secrets
    const FAL_API_KEY = Deno.env.get('FAL_API_KEY')
    if (!FAL_API_KEY) {
      throw new Error('FAL API key not configured')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Upload image to Supabase storage first
    const imageBuffer = Uint8Array.from(atob(imageData.split(',')[1]), c => c.charCodeAt(0))
    const fileName = `climate-image-${Date.now()}.png`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('generated-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png'
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error('Failed to upload image to storage')
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('generated-images')
      .getPublicUrl(fileName)

    const publicImageUrl = urlData.publicUrl

    console.log('Generating video with FAL AI using image:', publicImageUrl)

    // Generate video using FAL AI with correct Veo3 endpoint
    const response = await fetch('https://fal.run/fal-ai/veo3/fast/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        image_url: publicImageUrl,
        duration: "8s",
        generate_audio: true,
        resolution: "720p"
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('FAL API error:', errorText)
      throw new Error(`FAL API error: ${response.statusText} - ${errorText}`)
    }

    const result = await response.json()
    console.log('FAL API result:', result)
    
    if (!result.video?.url) {
      throw new Error('No video URL returned from FAL API')
    }
    
    return new Response(
      JSON.stringify({ 
        videoUrl: result.video.url,
        imageUrl: publicImageUrl 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Video generation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})