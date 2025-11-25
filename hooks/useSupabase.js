import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// Function to fetch all posts (videos)
const getAllPosts = async () => {
  const { data, error } = await supabase.storage.from("videos").list();

  if (error) {
    console.error("Error fetching videos:", error);
    return [];
  }

  return data
    // ✅ filter out Supabase's placeholder and non-video files
    .filter(
      (file) =>
        file.name !== ".emptyFolderPlaceholder" &&
        file.name.toLowerCase().endsWith(".mp4")
    )
    .map((file) => {
      const { data: { publicUrl } } = supabase
        .storage
        .from("videos")
        .getPublicUrl(file.name);

      return {
        $id: file.name,
        title: file.name, // placeholder until you add metadata
        creator: "Unknown", // placeholder until you add user info
        avatar: "https://placehold.co/100x100?text=User", // placeholder avatar
        thumbnail: `https://peqmsxyhkcxifotmzajo.supabase.co/storage/v1/object/public/thumbnails/${file.name.replace(".mp4", ".jpg")}`,
        video: encodeURI(publicUrl),
      };
    });
};

// Custom hook
export const useSupabase = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);
    const posts = await getAllPosts();
    setData(posts);
    setLoading(false);
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, loading, refetch };
};