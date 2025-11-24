import { View, Text, Button, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { router } from 'expo-router';

export default function Profile() {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('Error signing out:', error.message);
    } else {
      // Redirect back to index (unauthenticated entry point)
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161622',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
});