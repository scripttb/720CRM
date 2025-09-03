-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Companies policies
CREATE POLICY "companies_select_own" ON public.companies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "companies_insert_own" ON public.companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "companies_update_own" ON public.companies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "companies_delete_own" ON public.companies FOR DELETE USING (auth.uid() = user_id);

-- Contacts policies
CREATE POLICY "contacts_select_own" ON public.contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "contacts_insert_own" ON public.contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contacts_update_own" ON public.contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "contacts_delete_own" ON public.contacts FOR DELETE USING (auth.uid() = user_id);

-- Opportunities policies
CREATE POLICY "opportunities_select_own" ON public.opportunities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "opportunities_insert_own" ON public.opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "opportunities_update_own" ON public.opportunities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "opportunities_delete_own" ON public.opportunities FOR DELETE USING (auth.uid() = user_id);

-- Activities policies
CREATE POLICY "activities_select_own" ON public.activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "activities_insert_own" ON public.activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "activities_update_own" ON public.activities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "activities_delete_own" ON public.activities FOR DELETE USING (auth.uid() = user_id);

-- Invoices policies
CREATE POLICY "invoices_select_own" ON public.invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "invoices_insert_own" ON public.invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "invoices_update_own" ON public.invoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "invoices_delete_own" ON public.invoices FOR DELETE USING (auth.uid() = user_id);

-- Invoice items policies (access through invoice ownership)
CREATE POLICY "invoice_items_select_own" ON public.invoice_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));
CREATE POLICY "invoice_items_insert_own" ON public.invoice_items FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));
CREATE POLICY "invoice_items_update_own" ON public.invoice_items FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));
CREATE POLICY "invoice_items_delete_own" ON public.invoice_items FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid()));

-- Documents policies
CREATE POLICY "documents_select_own" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "documents_insert_own" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "documents_update_own" ON public.documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "documents_delete_own" ON public.documents FOR DELETE USING (auth.uid() = user_id);

-- Communications policies
CREATE POLICY "communications_select_own" ON public.communications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "communications_insert_own" ON public.communications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "communications_update_own" ON public.communications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "communications_delete_own" ON public.communications FOR DELETE USING (auth.uid() = user_id);
