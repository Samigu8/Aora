import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

export default function Page() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold">Aora!</Text>
      <StatusBar style="auto" />
      <Link href="/home" className="mt-4 px-4 py-2 rounded-lg">Go to Home</Link>
    </View>
  );
}
