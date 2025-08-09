-- Supabase Database Setup for Like System

-- Create likes table (stores total like counts per item)
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    item_id TEXT UNIQUE NOT NULL,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_likes table (tracks which users liked what)
CREATE TABLE user_likes (
    id SERIAL PRIMARY KEY,
    item_id TEXT NOT NULL,
    user_fingerprint TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(item_id, user_fingerprint)
);

-- Create indexes for better performance
CREATE INDEX idx_likes_item_id ON likes(item_id);
CREATE INDEX idx_user_likes_item_id ON user_likes(item_id);
CREATE INDEX idx_user_likes_fingerprint ON user_likes(user_fingerprint);

-- Enable Row Level Security (RLS)
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write access
CREATE POLICY "Allow public read on likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Allow public insert on likes" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on likes" ON likes FOR UPDATE USING (true);

CREATE POLICY "Allow public read on user_likes" ON user_likes FOR SELECT USING (true);
CREATE POLICY "Allow public insert on user_likes" ON user_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on user_likes" ON user_likes FOR DELETE USING (true);

-- Insert some initial data (optional - for testing)
-- You can skip this if you want to start fresh
INSERT INTO likes (item_id, like_count) VALUES 
    ('exploration-of-dopamine', 0),
    ('science-of-goal-setting', 0),
    ('age-of-ai', 0),
    ('ai-perception-architecture', 0),
    ('nereus-diving', 0),
    ('diary-app', 0),
    ('mern-fullstack', 0),
    ('redux-dashboard', 0),
    ('react-d3-chart', 0),
    ('eeg-brainwave-analysis', 0),
    ('health-calculator', 0),
    ('expanse-wallet', 0)
ON CONFLICT (item_id) DO NOTHING;
