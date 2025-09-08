-- Create storage bucket for generated images
INSERT INTO storage.buckets (id, name, public) VALUES ('generated-images', 'generated-images', true);

-- Create policies for generated images bucket
CREATE POLICY "Generated images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'generated-images');

CREATE POLICY "Anyone can upload generated images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'generated-images');

CREATE POLICY "Anyone can update generated images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'generated-images');