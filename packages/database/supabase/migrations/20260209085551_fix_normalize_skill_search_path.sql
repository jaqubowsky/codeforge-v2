CREATE OR REPLACE FUNCTION public.normalize_skill(skill_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(skill_name, '[.\-_\s]', '', 'g'),
      'js$', 'js', 'i'
    )
  );
END;
$$;
