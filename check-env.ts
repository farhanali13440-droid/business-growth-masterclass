console.log('SUPABASE_URL defined:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_URL starts with http:', process.env.SUPABASE_URL?.startsWith('http'));
console.log('SUPABASE_SERVICE_ROLE_KEY defined:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
if (process.env.SUPABASE_URL) {
    const url = new URL(process.env.SUPABASE_URL);
    console.log('SUPABASE_URL hostname:', url.hostname);
}
