// Test Supabase Connection
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Testing Supabase Connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'MISSING')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test 1: Check if table exists
    console.log('\n📋 Test 1: Checking health_reports table...')
    const { data, error } = await supabase
      .from('health_reports')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error:', error.message)
      return false
    }
    
    console.log('✅ Table exists! Found', data ? data.length : 0, 'records')
    
    // Test 2: Try to insert a test record
    console.log('\n📝 Test 2: Inserting test record...')
    const { data: insertData, error: insertError } = await supabase
      .from('health_reports')
      .insert({
        user_id: 'test_user',
        file_name: 'test.pdf',
        file_size: 1024,
        file_type: 'application/pdf',
        analysis: 'Test analysis',
        family_member_name: 'Test',
        relationship: 'Self'
      })
      .select()
    
    if (insertError) {
      console.error('❌ Insert Error:', insertError.message)
      return false
    }
    
    console.log('✅ Insert successful!')
    
    // Test 3: Delete test record
    if (insertData && insertData[0]) {
      console.log('\n🗑️  Test 3: Cleaning up test record...')
      await supabase
        .from('health_reports')
        .delete()
        .eq('id', insertData[0].id)
      console.log('✅ Cleanup successful!')
    }
    
    console.log('\n✅ All tests passed! Supabase is connected correctly.')
    return true
    
  } catch (err) {
    console.error('❌ Unexpected error:', err)
    return false
  }
}

testConnection()
