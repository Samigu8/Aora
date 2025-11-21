import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

export default function Page() {
  return (
    <View className="flex-1 items-center justify-center bg-green-500">
      <Text className="text-3xl font-bold">Styled Text</Text>
      <StatusBar style="auto" />
      <Link href="/profile" className="mt-4 px-4 py-2 bg-green-700 rounded-lg">Go to Profile</Link>
    </View>
  );
}
