import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://peqmsxyhkcxifotmzajo.supabase.co"
const supabasePublishableKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlcW1zeHloa2N4aWZvdG16YWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5Mjk2MjIsImV4cCI6MjA3OTUwNTYyMn0.Gw_NlN1cdglZE9RdPwSVxQ90sXGiQMl80pc-OGSRJJo"

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})