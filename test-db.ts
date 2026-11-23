import { supabaseAdmin } from './src/integrations/supabase/client.server';

async function test() {
  try {
    const { data, error, count } = await (supabaseAdmin as any)
      .from('clinic_growth_leads')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Connection Error:', error);
      process.exit(1);
    }
    console.log('Success! Table exists. Count:', count);
  } catch (e) {
    console.error('Execution Error:', e);
    process.exit(1);
  }
}
test();
