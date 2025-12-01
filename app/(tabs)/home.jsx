import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef } from "react";

import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { useSupabase } from "../../hooks/useSupabase";  // 👈 import hook

const Home = () => {
  const { data: posts, loading, refetch } = useSupabase();

  // Track which items are currently visible
  const viewableItems = useRef([]);
  const onViewableItemsChanged = useRef(({ viewableItems: items }) => {
    viewableItems.current = items.map((entry) => entry.item.$id);
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // at least 50% visible to count
  };

  return (
    <SafeAreaView className="bg-primary h-full">
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
            // 👇 Pass down whether this video should be playing
            isPlaying={viewableItems.current.includes(item.$id)}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between flex-row items-start mb-6">
              <View>
                <Text className="text-sm font-pmedium text-gray-100">
                  Welcome back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  JSMastery
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            {posts.length > 0 && (
              <View className="w-full flex-1 pt-5 pb-8">
                <Text className="text-gray-200 text-lg font-pregular mb-3">
                  Latest Videos
                </Text>
                <Trending posts={posts} />
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="Be the first to add a new video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        // 👇 Add viewability tracking
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </SafeAreaView>
  );
};

export default Home;