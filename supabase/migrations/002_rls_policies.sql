-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON profiles
  FOR ALL USING (is_admin());

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for cats
CREATE POLICY "Users can view own cats" ON cats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cats" ON cats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cats" ON cats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cats" ON cats
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all cats" ON cats
  FOR ALL USING (is_admin());

-- RLS Policies for plans
CREATE POLICY "Everyone can view active plans" ON plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage plans" ON plans
  FOR ALL USING (is_admin());

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all subscriptions" ON subscriptions
  FOR ALL USING (is_admin());

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending orders" ON orders
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND status = 'pending'
  ) WITH CHECK (
    auth.uid() = user_id 
    AND (status = OLD.status OR status = 'pending')
  );

CREATE POLICY "Admin can manage all orders" ON orders
  FOR ALL USING (is_admin());

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order items for own orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can manage all order items" ON order_items
  FOR ALL USING (is_admin());

-- RLS Policies for notifications
CREATE POLICY "Admin can manage notifications" ON notifications
  FOR ALL USING (is_admin());

CREATE POLICY "Users can view notifications for own orders" ON notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- RLS Policies for admin_settings
CREATE POLICY "Admin can manage settings" ON admin_settings
  FOR ALL USING (is_admin());