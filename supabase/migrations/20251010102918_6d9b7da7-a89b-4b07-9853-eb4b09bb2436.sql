-- First, make user_id nullable for sample projects
ALTER TABLE projects ALTER COLUMN user_id DROP NOT NULL;

-- Add project categories table
CREATE TABLE IF NOT EXISTS project_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add project tools/resources table
CREATE TABLE IF NOT EXISTS project_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  tool_type TEXT NOT NULL,
  icon_url TEXT,
  documentation_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tools ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and tools
CREATE POLICY "Anyone can view project categories"
  ON project_categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view project tools"
  ON project_tools FOR SELECT
  USING (true);

-- Admins can manage categories and tools
CREATE POLICY "Admins can manage project categories"
  ON project_categories FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage project tools"
  ON project_tools FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert categories
INSERT INTO project_categories (name, description, icon) VALUES
('AI & Machine Learning', 'Artificial Intelligence and Machine Learning projects', '🤖'),
('Web Development', 'Full-stack web applications and websites', '🌐'),
('Mobile Development', 'iOS and Android mobile applications', '📱'),
('IoT & Embedded', 'Internet of Things and hardware projects', '🔌'),
('Game Development', 'Video games and interactive experiences', '🎮'),
('Data Science', 'Data analysis and visualization projects', '📊'),
('Blockchain', 'Cryptocurrency and blockchain applications', '⛓️'),
('Cloud & DevOps', 'Cloud infrastructure and automation', '☁️'),
('Cybersecurity', 'Security tools and systems', '🔒'),
('Other', 'Miscellaneous projects', '✨');

-- Insert project tools
INSERT INTO project_tools (name, description, tool_type, documentation_url) VALUES
('VS Code', 'Popular code editor with extensions', 'ide', 'https://code.visualstudio.com/docs'),
('PyCharm', 'Python IDE for data science and web development', 'ide', 'https://www.jetbrains.com/pycharm/'),
('Android Studio', 'Official IDE for Android development', 'ide', 'https://developer.android.com/studio'),
('Unity', 'Game development engine', 'framework', 'https://docs.unity3d.com/'),
('React', 'JavaScript library for building UIs', 'library', 'https://react.dev/'),
('TensorFlow', 'Machine learning framework', 'framework', 'https://www.tensorflow.org/'),
('Docker', 'Container platform', 'service', 'https://docs.docker.com/'),
('Firebase', 'Backend-as-a-service platform', 'service', 'https://firebase.google.com/docs'),
('Arduino', 'Microcontroller platform', 'framework', 'https://www.arduino.cc/reference/'),
('Unreal Engine', 'Game development engine', 'framework', 'https://docs.unrealengine.com/');