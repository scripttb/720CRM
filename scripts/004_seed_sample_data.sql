-- Insert sample data (only if no data exists)
-- This will be executed after user authentication is set up

-- Sample companies (will be inserted with proper user_id after authentication)
INSERT INTO public.companies (name, email, phone, address, city, country, industry, size, user_id)
SELECT 
  'Empresa Exemplo Lda',
  'contato@exemplo.ao',
  '+244 923 456 789',
  'Rua da Independência, 123',
  'Luanda',
  'Angola',
  'Tecnologia',
  'Pequena',
  auth.uid()
WHERE NOT EXISTS (SELECT 1 FROM public.companies LIMIT 1)
AND auth.uid() IS NOT NULL;

-- Sample invoice number sequence
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1000;

-- Function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number(invoice_type TEXT DEFAULT 'invoice')
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  number INTEGER;
BEGIN
  CASE invoice_type
    WHEN 'proforma' THEN prefix := 'PF';
    WHEN 'invoice' THEN prefix := 'FT';
    WHEN 'credit_note' THEN prefix := 'NC';
    WHEN 'receipt' THEN prefix := 'RC';
    ELSE prefix := 'DOC';
  END CASE;
  
  number := nextval('invoice_number_seq');
  RETURN prefix || TO_CHAR(EXTRACT(YEAR FROM NOW()), 'YYYY') || '/' || LPAD(number::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;
