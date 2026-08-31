// Assisted using common GitHub development utilities
// Script to set up an admin user for testing
// Run this after creating a user account through the auth page

const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://czvkltyhkzbuvsvqdlun.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6dmtsdHloa3pidXZzdnFkbHVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDUxMTgxMSwiZXhwIjoyMDY2MDg3ODExfQ.g-EmjKB06zXK46-2AdupzKXhTsEePklWuBgqBqNCbTI'

async function setupAdminUser() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // List all users to help identify which one to make admin
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
      return
    }
    
    console.log('Available users:')
    users.users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (ID: ${user.id})`)
    })
    
    if (users.users.length === 0) {
      console.log('No users found. Please create a user account first at http://localhost:3000/auth')
      return
    }
    
    // For now, let's make the first user an admin
    const firstUser = users.users[0]
    console.log(`\nMaking ${firstUser.email} an admin...`)
    
    // Check if user_profiles table exists and create profile if needed
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', firstUser.id)
      .single()
    
    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error checking user profile:', profileError)
      return
    }
    
    if (!existingProfile) {
      // Create new profile
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: firstUser.id,
          email: firstUser.email,
          is_admin: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (insertError) {
        console.error('Error creating admin profile:', insertError)
        return
      }
      
      console.log(`✅ Successfully created admin profile for ${firstUser.email}`)
    } else {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          is_admin: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', firstUser.id)
      
      if (updateError) {
        console.error('Error updating profile to admin:', updateError)
        return
      }
      
      console.log(`✅ Successfully updated ${firstUser.email} to admin`)
    }
    
    console.log('\nYou can now log in with this user and access the admin dashboard!')
    console.log('Admin Dashboard: http://localhost:3000/admin/dashboard')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

setupAdminUser()
