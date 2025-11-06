-- Insert the "From Campus to Corporate" book with structured content
INSERT INTO books (
  title,
  description,
  author,
  category,
  is_free,
  is_featured,
  pages,
  cover_image_url
) VALUES (
  'From Campus to Corporate: Your First Real-World Upgrade',
  'College gives you degrees. The job world tests what you can actually do with them. This book is your map for that messy middle — the jump from late-night projects to 9 a.m. meetings, from marks to performance, from group chats to professional emails.',
  'PrepRight Team',
  'Professional Development',
  true,
  true,
  50,
  '/placeholder.svg'
);

-- Create a table to store book pages for better pagination
CREATE TABLE IF NOT EXISTS book_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  chapter_number TEXT,
  chapter_title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(book_id, page_number)
);

-- Enable RLS
ALTER TABLE book_pages ENABLE ROW LEVEL SECURITY;

-- Anyone can view book pages
CREATE POLICY "Anyone can view book pages"
  ON book_pages
  FOR SELECT
  USING (true);

-- Admins can manage book pages
CREATE POLICY "Admins can manage book pages"
  ON book_pages
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert pages for the Campus to Corporate book
WITH new_book AS (
  SELECT id FROM books WHERE title = 'From Campus to Corporate: Your First Real-World Upgrade' LIMIT 1
)
INSERT INTO book_pages (book_id, page_number, chapter_number, chapter_title, content)
SELECT 
  (SELECT id FROM new_book),
  page_number,
  chapter_number,
  chapter_title,
  content
FROM (VALUES
  (1, '1', 'Mindset Shift', E'The office isn''t an extension of your classroom — it''s a whole new arena.\n\nYou''ll learn how to:\n\n→ Switch from "someone will tell me" to "I''ll figure it out."\n\n→ Bounce back when things go sideways.\n\n→ Stay curious, motivated, and focused on progress, not perfection.\n\n→ Turn career goals into clear, measurable steps.\n\nKey Principle: Own Your Growth\n\nIn college, learning is structured. In the workplace, you have to create your own structure. The most successful professionals don''t wait for opportunities — they create them by being proactive, asking questions, and seeking feedback.'),
  (2, '1', 'Mindset Shift', E'Understanding the Corporate Mindset\n\nThe shift from academic to professional thinking requires:\n\n• Self-direction over hand-holding\n• Results over effort\n• Collaboration over competition\n• Long-term thinking over quick wins\n\nAction Steps:\n1. Set weekly learning goals\n2. Ask for feedback regularly\n3. Document your wins\n4. Reflect on failures without judgment\n\nRemember: Every expert was once a beginner. The difference is they never stopped learning.'),
  (3, '2', 'Professional Communication', E'Good communication isn''t fancy English; it''s clarity with respect.\n\nEmail Guidelines Checklist:\n\n✓ Clear and specific subject line\n✓ No spelling or grammatical errors\n✓ Simple language; minimal jargon\n✓ Correct salutation with proper title/name\n✓ Professional signature with designation\n✓ Concise and well-structured main content\n✓ Clear CTA (Call to Action)\n\nPro Tip: Read your email once before sending. Ask yourself: "Would I respond to this?"'),
  (4, '2', 'Professional Communication', E'Verbal Communication and Active Listening\n\nVerbal communication refers to how you express your words. Tone, pitch, and volume are extremely important in delivering your message. Even well-meaning words can be perceived as rude if delivered in the wrong tone.\n\nUnderstanding Listening Styles:\n\nHearing:\nWhen you are looking around, are distracted, not paying full attention, absorbing information in bits and pieces.\n\nListening:\nWhen you are trying to understand what the speaker is saying, but still not fully engaged.\n\nKey Skills:\n• Maintain eye contact\n• Ask clarifying questions\n• Paraphrase to confirm understanding\n• Avoid interrupting'),
  (5, '2', 'Professional Communication', E'Writing Professional Emails\n\nStructure of a Perfect Email:\n\n1. Subject Line\n   Keep it clear and action-oriented\n   Example: "Meeting Request: Q1 Review"\n\n2. Greeting\n   Use proper titles and names\n   Example: "Dear Mr. Sharma," or "Hi Team,"\n\n3. Opening\n   State your purpose immediately\n   Example: "I''m writing to follow up on..."\n\n4. Body\n   Keep it concise and organized\n   Use bullet points for clarity\n\n5. Closing\n   Include clear next steps\n   Example: "Please let me know by Friday."\n\n6. Signature\n   Include your full name and designation'),
  (6, '3', 'Corporate Etiquette', E'Every company has an unspoken rulebook. You''ll decode it here:\n\n→ Showing up on time (and why it still matters)\n→ Dressing for the vibe — smart, not overdressed\n→ Meeting manners that make you look seasoned\n→ Keeping boundaries while staying friendly\n→ Managing work pressure without burning out\n\nFirst Impressions Matter:\n\nYou never get a second chance to make a first impression. Your punctuality, appearance, and professional demeanor set the tone for how colleagues perceive you.\n\nDress Code Essentials:\n• Observe what senior colleagues wear\n• When in doubt, dress slightly more formal\n• Keep it clean and well-fitted\n• Avoid overly casual or flashy clothing'),
  (7, '3', 'Corporate Etiquette', E'Meeting Manners That Build Respect\n\nBefore the Meeting:\n✓ Review the agenda\n✓ Prepare your points\n✓ Arrive 5 minutes early\n✓ Bring necessary materials\n\nDuring the Meeting:\n✓ Listen actively\n✓ Take notes\n✓ Speak clearly and concisely\n✓ Avoid checking your phone\n✓ Respect others'' speaking time\n\nAfter the Meeting:\n✓ Follow up on action items\n✓ Send thank you notes if appropriate\n✓ Complete assigned tasks promptly\n\nRemember: Your behavior in meetings reflects your professionalism and commitment.'),
  (8, '4', 'Time Management', E'Deadlines aren''t scary when you control your day.\n\nLearn to:\n→ Prioritize what really moves the needle\n→ Plan your day like a pro — without overthinking\n→ Handle multiple projects and still have a life\n→ Kill procrastination with small, consistent wins\n\nThe Eisenhower Matrix:\n\nUrgent & Important: Do First\nThese are crisis situations and deadlines\n\nImportant, Not Urgent: Schedule\nLong-term goals and planning\n\nUrgent, Not Important: Delegate\nInterruptions and some emails\n\nNot Urgent, Not Important: Eliminate\nTime wasters and distractions'),
  (9, '4', 'Time Management', E'Daily Planning Strategy\n\nMorning Routine (30 mins):\n1. Review your calendar\n2. List top 3 priorities\n3. Block time for deep work\n4. Check urgent messages\n\nWork Blocks:\n• 90-minute focused sessions\n• 10-minute breaks between blocks\n• Minimize distractions during blocks\n• Track your progress\n\nEnd-of-Day Review (15 mins):\n1. Check off completed tasks\n2. Move incomplete items\n3. Plan tomorrow''s top 3\n4. Celebrate small wins\n\nPro Tip: Protect your most productive hours for your most important work.'),
  (10, '5', 'Networking Skills', E'It''s not about knowing everyone — it''s about being known for something.\n\nThis part helps you:\n→ Build connections that feel real\n→ Use LinkedIn without being cringey\n→ Follow up smartly and stay in touch\n→ Avoid the classic "networking gone wrong" moves\n\nNetworking Principles:\n\n1. Give Before You Ask\n   Offer value before seeking favors\n\n2. Be Genuine\n   People can sense authenticity\n\n3. Stay Consistent\n   Regular, meaningful touchpoints matter\n\n4. Quality Over Quantity\n   10 strong connections beat 100 weak ones')
) AS pages(page_number, chapter_number, chapter_title, content);