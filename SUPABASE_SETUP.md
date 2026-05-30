# Supabase Setup for WatchEarn

Run the following SQL in your Supabase SQL Editor to set up the necessary tables and functions.

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  balance DECIMAL DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  device_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  type TEXT CHECK (type IN ('reward', 'withdrawal')),
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')),
  currency TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" 
ON transactions FOR SELECT 
USING (auth.uid() = user_id);

-- RPC for incrementing balance (S2S Callback equivalent)
CREATE OR REPLACE FUNCTION increment_balance(user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET balance = balance + amount,
      total_views = total_views + 1
  WHERE id = user_id;
  
  INSERT INTO transactions (user_id, amount, type, status)
  VALUES (user_id, amount, 'reward', 'completed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC for deducting balance
CREATE OR REPLACE FUNCTION deduct_balance(user_id UUID, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  IF (SELECT balance FROM profiles WHERE id = user_id) < amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
  
  UPDATE profiles 
  SET balance = balance - amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Environment Variables
Add these to your `.env` or Vercel Environment Variables:
- `VITE_SUPABASE_URL`: Your Supabase Project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
- `FLUTTERWAVE_SECRET_KEY`: Your Flutterwave Secret Key (for the backend functions)
- `AD_NETWORK_S2S_SECRET`: Secret for S2S signature verification