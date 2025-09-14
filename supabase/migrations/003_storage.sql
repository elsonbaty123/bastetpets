-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('medical_files', 'medical_files', false),
  ('brand_assets', 'brand_assets', false);

-- Storage policies for medical_files bucket
CREATE POLICY "Users can upload medical files for own cats" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'medical_files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own medical files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'medical_files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own medical files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'medical_files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own medical files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'medical_files'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Admin can view all medical files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'medical_files'
    AND is_admin()
  );

-- Storage policies for brand_assets bucket
CREATE POLICY "Admin can manage brand assets" ON storage.objects
  FOR ALL USING (
    bucket_id = 'brand_assets'
    AND is_admin()
  );

CREATE POLICY "Everyone can view brand assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'brand_assets');