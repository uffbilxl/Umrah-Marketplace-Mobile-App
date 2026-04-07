
-- Create profiles table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL,
    phone_number text,
    preferred_store_location text,
    points integer NOT NULL DEFAULT 0,
    tier text NOT NULL DEFAULT 'Bronze',
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create products table
CREATE TABLE public.products (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    category text NOT NULL,
    price numeric(10,2) NOT NULL,
    member_discount numeric(5,2) NOT NULL DEFAULT 0,
    image_url text,
    brand text,
    weight text,
    in_stock boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- Create purchases table
CREATE TABLE public.purchases (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date timestamptz NOT NULL DEFAULT now(),
    total_spent numeric(10,2) NOT NULL,
    points_earned integer NOT NULL DEFAULT 0,
    store_location text
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases" ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own purchases" ON public.purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create purchase_items table
CREATE TABLE public.purchase_items (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    purchase_id bigint NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
    product_id bigint NOT NULL REFERENCES public.products(id),
    quantity integer NOT NULL DEFAULT 1,
    unit_price numeric(10,2) NOT NULL
);

ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchase items" ON public.purchase_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.purchases WHERE purchases.id = purchase_items.purchase_id AND purchases.user_id = auth.uid())
);
CREATE POLICY "Users can insert their own purchase items" ON public.purchase_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.purchases WHERE purchases.id = purchase_items.purchase_id AND purchases.user_id = auth.uid())
);
