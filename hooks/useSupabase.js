import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const getStorageUrl = (bucket, path) => {
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return encodeURI(publicUrl);
};

export const mapVideoRow = (row) => {
  const filename = row.filename || row.video || "";
  const thumbnailName = filename.replace(/\.[^/.]+$/, ".jpg");

  return {
    $id: row.id || filename,
    title: row.title || filename,
    creator: row.creator || "Unknown",
    avatar: row.avatar || "https://placehold.co/100x100?text=User",
    thumbnail: row.thumbnail || getStorageUrl("thumbnails", thumbnailName),
    video: row.video || getStorageUrl("videos", filename),
  };
};

const getAllPosts = async () => {
  const { data, error } = await supabase.storage.from("videos").list();

  if (error) {
    console.error("Error fetching videos:", error);
    return [];
  }

  return data
    .filter(
      (file) =>
        file.name !== ".emptyFolderPlaceholder" &&
        file.name.toLowerCase().endsWith(".mp4")
    )
    .map((file) =>
      mapVideoRow({
        $id: file.name,
        filename: file.name,
        title: file.name,
      })
    );
};

// ✅ Hook for listing all videos (Home screen)
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

export const useSearchPosts = (query) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);

    const safeQuery = query.trim();

    const { data: rows, error } = await supabase
      .from("videos")
      .select("*")
      .or(`title.ilike.%${safeQuery}%,filename.ilike.%${safeQuery}%`);

    if (error) {
      console.error("Error searching videos:", error);
      setData([]);
    } else {
      setData(rows.map(mapVideoRow));
    }

    setLoading(false);
  };

  useEffect(() => {
    if (query) {
      refetch();
    } else {
      setData([]);
      setLoading(false);
    }
  }, [query]);

  return { data, loading, refetch };
};