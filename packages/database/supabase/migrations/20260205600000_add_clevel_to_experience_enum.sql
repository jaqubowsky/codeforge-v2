-- Add c-level to experience_level_enum for C-level executive positions
ALTER TYPE experience_level_enum ADD VALUE IF NOT EXISTS 'c-level';
