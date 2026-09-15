CREATE TYPE public.input_source_type AS ENUM ('youtube','tiktok','audio','image','text');
CREATE TYPE public.input_status AS ENUM ('pending','processing','completed','failed');
CREATE TYPE public.lesson_language AS ENUM ('english','chinese');
CREATE TYPE public.lesson_status AS ENUM ('draft','published');

CREATE TABLE public.inputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type public.input_source_type NOT NULL,
  source_url text,
  raw_content text,
  status public.input_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input_id uuid REFERENCES public.inputs(id) ON DELETE SET NULL,
  title text NOT NULL,
  language public.lesson_language NOT NULL,
  level text,
  reasoning text,
  status public.lesson_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_lessons_input_id ON public.lessons(input_id);

CREATE TABLE public.lesson_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  content text NOT NULL,
  pinyin_content text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_lesson_readings_lesson_id ON public.lesson_readings(lesson_id);

CREATE TABLE public.lesson_vocabularies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  word text NOT NULL,
  pronunciation text,
  word_type text,
  meaning text,
  example text,
  example_meaning text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_lesson_vocabularies_lesson_id ON public.lesson_vocabularies(lesson_id);

CREATE TABLE public.lesson_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer text,
  explanation text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_lesson_quizzes_lesson_id ON public.lesson_quizzes(lesson_id);

CREATE TABLE public.lesson_worksheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  question text NOT NULL,
  correct_answer text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_lesson_worksheets_lesson_id ON public.lesson_worksheets(lesson_id);

CREATE TABLE public.lesson_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  game_type text NOT NULL,
  game_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_lesson_games_lesson_id ON public.lesson_games(lesson_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.inputs TO authenticated;
GRANT ALL ON public.inputs TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT SELECT ON public.lessons TO anon;
GRANT ALL ON public.lessons TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_readings TO authenticated;
GRANT SELECT ON public.lesson_readings TO anon;
GRANT ALL ON public.lesson_readings TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_vocabularies TO authenticated;
GRANT SELECT ON public.lesson_vocabularies TO anon;
GRANT ALL ON public.lesson_vocabularies TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_quizzes TO authenticated;
GRANT SELECT ON public.lesson_quizzes TO anon;
GRANT ALL ON public.lesson_quizzes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_worksheets TO authenticated;
GRANT SELECT ON public.lesson_worksheets TO anon;
GRANT ALL ON public.lesson_worksheets TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_games TO authenticated;
GRANT SELECT ON public.lesson_games TO anon;
GRANT ALL ON public.lesson_games TO service_role;

ALTER TABLE public.inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_vocabularies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inputs_authenticated_all" ON public.inputs FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "lessons_public_read_published" ON public.lessons FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "lessons_authenticated_all" ON public.lessons FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "lesson_readings_public_read" ON public.lesson_readings FOR SELECT TO anon USING (EXISTS (SELECT 1 FROM public.lessons l WHERE l.id = lesson_id AND l.status = 'published'));
CREATE POLICY "lesson_readings_authenticated_all" ON public.lesson_readings FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "lesson_vocabularies_public_read" ON public.lesson_vocabularies FOR SELECT TO anon USING (EXISTS (SELECT 1 FROM public.lessons l WHERE l.id = lesson_id AND l.status = 'published'));
CREATE POLICY "lesson_vocabularies_authenticated_all" ON public.lesson_vocabularies FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "lesson_quizzes_public_read" ON public.lesson_quizzes FOR SELECT TO anon USING (EXISTS (SELECT 1 FROM public.lessons l WHERE l.id = lesson_id AND l.status = 'published'));
CREATE POLICY "lesson_quizzes_authenticated_all" ON public.lesson_quizzes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "lesson_worksheets_public_read" ON public.lesson_worksheets FOR SELECT TO anon USING (EXISTS (SELECT 1 FROM public.lessons l WHERE l.id = lesson_id AND l.status = 'published'));
CREATE POLICY "lesson_worksheets_authenticated_all" ON public.lesson_worksheets FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "lesson_games_public_read" ON public.lesson_games FOR SELECT TO anon USING (EXISTS (SELECT 1 FROM public.lessons l WHERE l.id = lesson_id AND l.status = 'published'));
CREATE POLICY "lesson_games_authenticated_all" ON public.lesson_games FOR ALL TO authenticated USING (true) WITH CHECK (true);