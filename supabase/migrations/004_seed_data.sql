-- Seed data for plans
INSERT INTO plans (name, description, price, currency, is_active) VALUES
  ('Weekly', 'خطة أسبوعية مثالية لتجربة خدماتنا مع قطتك', 299.00, 'جنيه', true),
  ('Monthly', 'خطة شهرية توفر قيمة أفضل مع استشارة تغذية مجانية', 999.00, 'جنيه', true)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  is_active = EXCLUDED.is_active;

-- Seed default admin settings
INSERT INTO admin_settings (
  admin_email,
  admin_whatsapp_number_e164,
  base_url,
  cities_served,
  currency,
  calorie_density_kcal_per_100g,
  whatsapp_cloud_api_enabled,
  brand_theme,
  brand_fonts
) VALUES (
  COALESCE(current_setting('app.admin_email', true), 'admin@bastet.com'),
  COALESCE(current_setting('app.admin_whatsapp', true), '+201234567890'),
  COALESCE(current_setting('app.base_url', true), 'http://localhost:3000'),
  ARRAY['القاهرة', 'الجيزة', 'الإسكندرية', 'الشرقية', 'الدقهلية', 'المنوفية', 'القليوبية'],
  'جنيه',
  350.0,
  false,
  '{
    \"colors\": {
      \"primary\": \"221 83% 53%\",
      \"primaryForeground\": \"210 40% 98%\",
      \"secondary\": \"210 40% 96%\",
      \"accent\": \"210 40% 96%\",
      \"neutral\": \"215 16% 47%\",
      \"success\": \"142 76% 36%\",
      \"warning\": \"38 92% 50%\",
      \"destructive\": \"0 84% 60%\"
    },
    \"scales\": {
      \"primary\": {
        \"50\": \"214 100% 97%\",
        \"100\": \"214 95% 93%\",
        \"200\": \"213 97% 87%\",
        \"300\": \"212 96% 78%\",
        \"400\": \"213 94% 68%\",
        \"500\": \"217 91% 60%\",
        \"600\": \"221 83% 53%\",
        \"700\": \"224 76% 48%\",
        \"800\": \"226 71% 40%\",
        \"900\": \"224 64% 33%\"
      },
      \"gray\": {
        \"50\": \"210 40% 98%\",
        \"100\": \"210 40% 96%\",
        \"200\": \"214 32% 91%\",
        \"300\": \"213 27% 84%\",
        \"400\": \"215 20% 65%\",
        \"500\": \"215 16% 47%\",
        \"600\": \"215 19% 35%\",
        \"700\": \"215 25% 27%\",
        \"800\": \"217 33% 17%\",
        \"900\": \"222 84% 5%\"
      }
    },
    \"radii\": {
      \"sm\": \"0.375rem\",
      \"md\": \"0.5rem\",
      \"lg\": \"0.75rem\"
    },
    \"shadows\": {
      \"sm\": \"0 1px 2px 0 rgb(0 0 0 / 0.05)\",
      \"md\": \"0 4px 6px -1px rgb(0 0 0 / 0.1)\",
      \"lg\": \"0 10px 15px -3px rgb(0 0 0 / 0.1)\"
    },
    \"borderStyle\": \"rounded\"
  }',
  '{
    \"heading\": \"Cairo\",
    \"body\": \"Tajawal\",
    \"fallback\": \"system-ui, sans-serif\"
  }'
)
ON CONFLICT (id) DO UPDATE SET
  admin_email = EXCLUDED.admin_email,
  admin_whatsapp_number_e164 = EXCLUDED.admin_whatsapp_number_e164,
  base_url = EXCLUDED.base_url,
  cities_served = EXCLUDED.cities_served,
  currency = EXCLUDED.currency,
  calorie_density_kcal_per_100g = EXCLUDED.calorie_density_kcal_per_100g,
  brand_theme = EXCLUDED.brand_theme,
  brand_fonts = EXCLUDED.brand_fonts
WHERE admin_settings.brand_theme IS NULL OR admin_settings.brand_fonts IS NULL;