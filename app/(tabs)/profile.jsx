import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { router } from "expo-router";
import VideoCard from "../../components/VideoCard";
import InfoBox from "../../components/InfoBox";
import { mapVideoRow } from "../../hooks/useSupabase";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(data.user);
        fetchUserPosts(data.user.email);
      }
    };
    fetchUser();
  }, []);

  const fetchUserPosts = async (creatorEmail) => {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("creator", creatorEmail);

    if (error) {
      console.error("Error fetching posts:", error.message);
    } else {
      setPosts(data.map(mapVideoRow));
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="px-4 py-6">
        {/* Avatar + Username */}
        <View className="flex-row justify-center space-x-4 mb-6">
          <Image
            source={{ uri: user?.user_metadata?.avatar || "https://placehold.co/100x100?text=U" }}
            className="w-16 h-16 rounded-full"
          />
          <View>
            <Text className="text-white text-xl font-psemibold">
              {user?.user_metadata?.username || "User"}
            </Text>
          </View>
        </View>

        {/* Info Boxes */}
        <View className="flex-row space-x-4 mb-4 justify-center">
          <InfoBox title={posts.length.toString()} subtitle="Posts  " />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-500 py-3 rounded-xl mb-6"
          onPress={handleSignOut}
        >
          <Text className="text-white text-center font-psemibold">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Video Grid */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            creator={item.creator}
            avatar={item.avatar}
            thumbnail={item.thumbnail}
            video={item.video}
          />
        )}
        ListEmptyComponent={() => (
          <Text className="text-center text-gray-300 mt-10">
            No videos found
          </Text>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}