import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { router } from 'expo-router'

const AuthLayout = () => {
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/home'); // redirect if already logged in
      }
    };
    checkSession();
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="sign-up"
          options={{ headerShown: false }}
        />
      </Stack>

      <StatusBar backgroundColor='#161622' style='light'/>
    </>
  )
}

export default AuthLayout