/*
  # Create responses table for AI prompts

  1. New Tables
    - `responses`
      - `id` (uuid, primary key)
      - `prompt` (text, not null)
      - `response` (text, not null)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `responses` table
    - Add policies for authenticated users to read and insert their own responses
*/

CREATE TABLE IF NOT EXISTS responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt text NOT NULL,
  response text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own responses"
  ON responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responses"
  ON responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);