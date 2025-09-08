import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('=== EDGE FUNCTION STARTED ===')
  
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request received')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== VIDEO GENERATION REQUEST START ===')
    console.log('Request method:', req.method)
    console.log('Request URL:', req.url)
    
    // Check if FAL API key exists first
    const FAL_API_KEY = Deno.env.get('FAL_API_KEY')
    console.log('FAL_API_KEY exists:', !!FAL_API_KEY)
    console.log('FAL_API_KEY length:', FAL_API_KEY?.length || 0)
    
    if (!FAL_API_KEY) {
      console.error('FAL API key not configured in secrets')
      return new Response(
        JSON.stringify({ 
          error: 'FAL API key not configured. Please add FAL_API_KEY to your Supabase secrets.',
          step: 'api_key_check'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }
    
    let requestBody;
    try {
      requestBody = await req.json()
      console.log('Request body parsed successfully')
      console.log('Request body keys:', Object.keys(requestBody))
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          step: 'json_parse',
          details: parseError.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }
    
    console.log('Has imageData:', !!requestBody.imageData)
    console.log('Has prompt:', !!requestBody.prompt)
    console.log('Prompt length:', requestBody.prompt?.length || 0)
    
    const { imageData, prompt } = requestBody

    if (!imageData || !prompt) {
      console.error('Missing required parameters:', { 
        hasImageData: !!imageData, 
        hasPrompt: !!prompt 
      })
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters: imageData and prompt are required',
          step: 'parameter_validation',
          received: {
            hasImageData: !!imageData,
            hasPrompt: !!prompt
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    console.log('Parameters validated successfully')

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Supabase client initialized, uploading image...')

    // Upload image to Supabase storage first
    console.log('Processing image data...')
    
    const fileName = `climate-image-${Date.now()}.png`
    console.log('Generated filename:', fileName)
    
    try {
      const imageBuffer = Uint8Array.from(atob(imageData.split(',')[1]), c => c.charCodeAt(0))
      console.log('Image buffer created, size:', imageBuffer.length)
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('generated-images')
        .upload(fileName, imageBuffer, {
          contentType: 'image/png'
        })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        throw new Error(`Failed to upload image to storage: ${uploadError.message}`)
      }

      console.log('Image uploaded successfully:', uploadData)
    } catch (imageError) {
      console.error('Image processing error:', imageError)
      throw new Error(`Image processing failed: ${imageError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('generated-images')
      .getPublicUrl(fileName)

    const publicImageUrl = urlData.publicUrl

    console.log('Public URL generated:', publicImageUrl)
    console.log('Starting video generation with optimized settings...')
    console.log('Prompt:', prompt)
    
    const falRequestBody = {
      prompt: prompt,
      image_url: publicImageUrl,
      duration: "4s", // Reduced from 8s for faster generation
      generate_audio: false, // Disabled for faster processing
      resolution: "720p"
    }
    
    console.log('FAL request body:', JSON.stringify(falRequestBody, null, 2))

    // Generate video using FAL AI with optimized settings for speed
    const response = await fetch('https://fal.run/fal-ai/veo3/fast/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(falRequestBody),
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
        success: true,
        videoUrl: result.video.url,
        imageUrl: publicImageUrl 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('=== VIDEO GENERATION ERROR ===')
    console.error('Error type:', error?.constructor?.name || 'Unknown')
    console.error('Error message:', error?.message || 'No message')
    console.error('Error stack:', error?.stack || 'No stack')
    console.error('=== END ERROR DETAILS ===')
    
    return new Response(
      JSON.stringify({ 
        error: error?.message || 'Unknown error occurred',
        details: error?.stack || 'No stack trace available',
        step: 'execution_error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})