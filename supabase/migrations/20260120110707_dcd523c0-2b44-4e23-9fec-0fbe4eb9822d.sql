-- Allow authenticated users to view leaderboard data (limited columns)
CREATE POLICY "Users can view leaderboard"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;