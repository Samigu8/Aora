import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef } from "react";

import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { useSearchPosts } from "../../hooks/useSupabase";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams(); // ✅ dynamic param
  const searchTerm = query || "";

  const { data: posts, loading, refetch } = useSearchPosts(searchTerm);

  // Debug logs
  console.log("Dynamic route param:", query);
  console.log("Search term:", searchTerm);
  console.log("Posts:", posts);

  const viewableItems = useRef([]);
  const onViewableItemsChanged = useRef(({ viewableItems: vItems }) => {
    viewableItems.current = vItems.map((v) => v.item.$id);
  });

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
            isPlaying={viewableItems.current.includes(item.$id)}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="text-sm font-pmedium text-gray-100">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white">{searchTerm}</Text>
            <SearchInput initialQuery={searchTerm} />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="Be the first to add a new video"
          />
        )}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      />
    </SafeAreaView>
  );
};

export default Search;