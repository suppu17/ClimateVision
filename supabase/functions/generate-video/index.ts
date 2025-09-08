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
      console.error('FAL API key not configured')
      throw new Error('FAL API key not configured')
    }

    console.log('FAL API key found, proceeding with video generation...')

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Supabase client initialized, uploading image...')

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
      throw new Error(`Failed to upload image to storage: ${uploadError.message}`)
    }

    console.log('Image uploaded successfully, generating public URL...')

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('generated-images')
      .getPublicUrl(fileName)

    const publicImageUrl = urlData.publicUrl

    console.log('Public URL generated:', publicImageUrl)
    console.log('Starting video generation with optimized settings...')
    console.log('Prompt:', prompt)

    console.log('Starting video generation with FAL AI...')

    // Generate video using FAL AI with optimized settings for speed
    const response = await fetch('https://fal.run/fal-ai/veo3/fast/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        image_url: publicImageUrl,
        duration: "4s", // Reduced from 8s for faster generation
        generate_audio: false, // Disabled for faster processing
        resolution: "720p"
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('FAL API error response:', response.status, response.statusText)
      console.error('FAL API error details:', errorText)
      throw new Error(`FAL API error (${response.status}): ${errorText}`)
    }

    console.log('FAL API responded successfully, processing result...')

    const result = await response.json()
    console.log('FAL API result received')
    console.log('Video generation completed successfully')
    
    if (!result.video?.url) {
      console.error('No video URL in result:', result)
      throw new Error('No video URL returned from FAL API')
    }
    
    console.log('Video URL:', result.video.url)
    console.log('Returning successful response...')
    
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