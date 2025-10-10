-- Make user_id nullable for demo projects
ALTER TABLE projects ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policy
DROP POLICY IF EXISTS "Users can manage own projects" ON projects;
CREATE POLICY "Users can manage own projects" ON projects 
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- Create categories table
CREATE TABLE IF NOT EXISTS project_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tools table  
CREATE TABLE IF NOT EXISTS project_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  tool_type TEXT NOT NULL,
  icon_url TEXT,
  documentation_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tools ENABLE ROW LEVEL SECURITY;

-- Public access
CREATE POLICY "Anyone can view categories" ON project_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view tools" ON project_tools FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON project_categories FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage tools" ON project_tools FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert categories
INSERT INTO project_categories (name, description, icon) VALUES
('AI & ML', 'Artificial Intelligence', '🤖'),
('Web Dev', 'Web Applications', '🌐'),
('Mobile', 'Mobile Apps', '📱'),
('IoT', 'IoT Projects', '🔌'),
('Games', 'Game Development', '🎮'),
('Data Science', 'Data Analysis', '📊'),
('Blockchain', 'Crypto & Web3', '⛓️'),
('Cloud', 'Cloud & DevOps', '☁️'),
('Security', 'Cybersecurity', '🔒'),
('Other', 'Miscellaneous', '✨');

-- Insert tools
INSERT INTO project_tools (name, description, tool_type, documentation_url) VALUES
('VS Code', 'Code editor', 'ide', 'https://code.visualstudio.com/docs'),
('PyCharm', 'Python IDE', 'ide', 'https://jetbrains.com/pycharm'),
('React', 'UI library', 'library', 'https://react.dev'),
('TensorFlow', 'ML framework', 'framework', 'https://tensorflow.org'),
('Unity', 'Game engine', 'framework', 'https://docs.unity3d.com'),
('Docker', 'Containers', 'service', 'https://docs.docker.com'),
('Firebase', 'Backend platform', 'service', 'https://firebase.google.com/docs'),
('Arduino', 'IoT platform', 'framework', 'https://arduino.cc/reference'),
('Flutter', 'Mobile framework', 'framework', 'https://docs.flutter.dev'),
('Node.js', 'JavaScript runtime', 'runtime', 'https://nodejs.org/docs');