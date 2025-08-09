// Supabase Configuration
// Note: These are public keys safe for client-side use
// Real security comes from RLS policies in Supabase

const SUPABASE_CONFIG = {
    // For development
    development: {
        url: 'https://fnnstbchphhygwqsviwl.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZubnN0YmNocGhoeWd3cXN2aXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3Mzk2NTgsImV4cCI6MjA3MDMxNTY1OH0.bw67IEVwsBdP0-q-Dr8V61KWoE5axrnDmAqAONWJWyc'
    },
    
    // For production (same values for static sites)
    production: {
        url: 'https://fnnstbchphhygwqsviwl.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZubnN0YmNocGhoeWd3cXN2aXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3Mzk2NTgsImV4cCI6MjA3MDMxNTY1OH0.bw67IEVwsBdP0-q-Dr8V61KWoE5axrnDmAqAONWJWyc'
    }
};

// Determine environment
function getEnvironment() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'development';
    }
    return 'production';
}

// Get current config
function getSupabaseConfig() {
    const env = getEnvironment();
    return SUPABASE_CONFIG[env];
}

// Export for use
window.SupabaseConfig = {
    get: getSupabaseConfig,
    environment: getEnvironment()
};
