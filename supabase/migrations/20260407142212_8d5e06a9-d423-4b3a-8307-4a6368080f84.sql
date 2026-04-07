
CREATE TABLE public.vouchers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL,
  code text NOT NULL UNIQUE,
  value numeric NOT NULL,
  points_spent integer NOT NULL DEFAULT 0,
  used boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own vouchers"
ON public.vouchers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vouchers"
ON public.vouchers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vouchers"
ON public.vouchers FOR UPDATE
USING (auth.uid() = user_id);
