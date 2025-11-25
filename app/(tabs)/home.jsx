import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../../constants';
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import { supabase } from '../../lib/supabase';

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);

  // Fetch videos from Supabase bucket
  const fetchVideos = async () => {
    const { data, error } = await supabase.storage.from('videos').list();

    if (error) {
      console.error('Error fetching videos:', error);
      return;
    }

    // Map each file to a usable object
const mapped = data
  // filter only .mp4 files
  .filter((file) => file.name.endsWith(".mp4"))
  .map((file) => {
    const { data: { publicUrl } } = supabase
      .storage
      .from("videos")
      .getPublicUrl(file.name);

    const encodedUrl = encodeURI(publicUrl);

    return {
      $id: file.name,
      thumbnail: "https://placehold.co/300x400?text=Video",
      video: encodedUrl,
    };
  });

// If no videos, posts will be []

    setPosts(mapped);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVideos();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={null} // we only render via ListHeaderComponent
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;