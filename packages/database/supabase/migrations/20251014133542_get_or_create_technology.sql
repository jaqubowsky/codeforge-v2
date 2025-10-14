CREATE OR REPLACE FUNCTION get_or_create_technology(tech_name TEXT)
RETURNS BIGINT AS $$
DECLARE
  tech_id BIGINT;
BEGIN
  -- First, try to insert the new technology name.
  INSERT INTO public.technologies (name)
  VALUES (tech_name)
  ON CONFLICT (LOWER(name)) DO NOTHING -- If it already exists, do nothing.
  RETURNING id INTO tech_id;

  -- If the INSERT was skipped due to a conflict, tech_id will be NULL.
  -- In that case, we must SELECT the ID of the existing row.
  IF tech_id IS NULL THEN
    SELECT id INTO tech_id FROM public.technologies WHERE LOWER(name) = LOWER(tech_name);
  END IF;

  RETURN tech_id;
END;
$$ LANGUAGE plpgsql;
