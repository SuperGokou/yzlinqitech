-- Enable moddatetime extension for auto-updating updated_at
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- PROFILES (must be created before is_admin() function)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

-- Helper: Admin check function (SECURITY DEFINER bypasses RLS to avoid recursion)
-- Must be created after profiles table exists
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Users can update own profile (excluding role)" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin());

-- SERVICES
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_zh TEXT NOT NULL, title_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_zh TEXT, description_en TEXT,
  icon TEXT, tags TEXT[] DEFAULT '{}',
  features_zh TEXT[] DEFAULT '{}', features_en TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true, sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (public.is_admin());

-- ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  title TEXT NOT NULL, description TEXT NOT NULL,
  budget_range TEXT, attachments JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','quoted','confirmed','in_progress','delivered','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own orders" ON public.orders FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (public.is_admin());
CREATE POLICY "Authenticated users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND client_id = auth.uid());
CREATE POLICY "Admins can update all orders" ON public.orders FOR UPDATE USING (public.is_admin());
CREATE POLICY "Clients can cancel own orders" ON public.orders FOR UPDATE USING (client_id = auth.uid()) WITH CHECK (status = 'cancelled');

-- QUOTES
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount DECIMAL(12,2) NOT NULL, currency TEXT DEFAULT 'CNY',
  breakdown JSONB, valid_until DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','accepted','rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER quotes_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view quotes for own orders" ON public.quotes FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND client_id = auth.uid()));
CREATE POLICY "Admins can manage all quotes" ON public.quotes FOR ALL USING (public.is_admin());

-- MESSAGES (Realtime enabled)
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL, attachments JSONB DEFAULT '[]',
  read_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order participants can view messages" ON public.messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND client_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Order participants can send messages" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid() AND (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND client_id = auth.uid()) OR public.is_admin()));
CREATE POLICY "Order participants can mark messages as read" ON public.messages FOR UPDATE USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND client_id = auth.uid()) OR public.is_admin()) WITH CHECK (read_at IS NOT NULL);

-- PORTFOLIO ITEMS
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_zh TEXT NOT NULL, title_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_zh TEXT, description_en TEXT,
  images TEXT[] DEFAULT '{}', category TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false, sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER portfolio_items_updated_at BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view portfolio items" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage portfolio items" ON public.portfolio_items FOR ALL USING (public.is_admin());

-- BLOG POSTS
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_zh TEXT NOT NULL, title_en TEXT NOT NULL,
  excerpt_zh TEXT, excerpt_en TEXT,
  content_zh TEXT NOT NULL, content_en TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}', tag_color TEXT,
  read_time INT DEFAULT 5,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ, is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (public.is_admin());

-- SITE CONTENT
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL, key TEXT NOT NULL,
  value_zh TEXT, value_en TEXT,
  type TEXT CHECK (type IN ('text','number','image','url')),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(section, key)
);
CREATE TRIGGER site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins can manage site content" ON public.site_content FOR ALL USING (public.is_admin());

-- NOTE: Storage buckets must be created via Supabase Dashboard or CLI, not SQL.
