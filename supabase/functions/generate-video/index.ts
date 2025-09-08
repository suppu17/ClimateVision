import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('=== VIDEO GENERATION FUNCTION STARTED ===')

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Processing video generation request...')

    // Parse request body
    const body = await req.json()
    const { imageData, prompt } = body

    console.log('Request data:', {
      hasImageData: !!imageData,
      hasPrompt: !!prompt,
      promptLength: prompt?.length
    })

    if (!imageData || !prompt) {
      throw new Error('Missing imageData or prompt')
    }

    // Get FAL API key
    const FAL_API_KEY = Deno.env.get('FAL_API_KEY')
    if (!FAL_API_KEY) {
      throw new Error('FAL API key not found')
    }

    console.log('FAL API key found, length:', FAL_API_KEY.length)

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Upload image to storage
    console.log('Uploading image to storage...')
    const imageBuffer = Uint8Array.from(atob(imageData.split(',')[1]), c => c.charCodeAt(0))
    const fileName = `video-${Date.now()}.png`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('generated-images')
      .upload(fileName, imageBuffer, { contentType: 'image/png' })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('generated-images')
      .getPublicUrl(fileName)

    const imageUrl = urlData.publicUrl
    console.log('Image uploaded, URL:', imageUrl)

    // Call FAL API
    console.log('Calling FAL API...')
    const falResponse = await fetch('https://fal.run/fal-ai/veo3/fast/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        image_url: imageUrl,
        duration: "4s",
        generate_audio: false,
        resolution: "720p"
      }),
    })

    console.log('FAL API response status:', falResponse.status)

    if (!falResponse.ok) {
      const errorText = await falResponse.text()
      console.error('FAL API error:', errorText)
      throw new Error(`FAL API error: ${falResponse.status} - ${errorText}`)
    }

    const result = await falResponse.json()
    console.log('FAL API success, video URL:', result.video?.url)

    if (!result.video?.url) {
      throw new Error('No video URL in response')
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        videoUrl: result.video.url,
        imageUrl: imageUrl 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Video generation error:', error.message)
    console.error('Stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})