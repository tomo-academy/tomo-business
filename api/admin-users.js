import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin email (basic security)
  const { adminEmail } = req.query;
  if (adminEmail !== 'tomoacademyofficial@gmail.com') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      process.env.VITE_PUBLIC_SUPABASE_URL,
      process.env.T_SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get all users from auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Auth error:', authError);
      return res.status(500).json({ error: 'Failed to fetch users from auth' });
    }

    // Get user data and card counts
    const usersWithData = await Promise.all(
      (authData.users || []).map(async (authUser) => {
        // Get user data from users table
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        // Get business cards count
        const { data: cards } = await supabaseAdmin
          .from('business_cards')
          .select('id')
          .eq('user_id', authUser.id)
          .eq('is_active', true);

        // Get YouTube cards count
        const { data: ytCards } = await supabaseAdmin
          .from('youtube_cards')
          .select('id')
          .eq('user_id', authUser.id);

        // Get auth provider from app_metadata
        const authProvider = authUser.app_metadata?.provider || 'email';

        return {
          id: authUser.id,
          email: authUser.email || '',
          name: userData?.name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at,
          card_count: cards?.length || 0,
          youtube_card_count: ytCards?.length || 0,
          auth_provider: authProvider
        };
      })
    );

    return res.status(200).json({ users: usersWithData });
  } catch (error) {
    console.error('Error in admin API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
