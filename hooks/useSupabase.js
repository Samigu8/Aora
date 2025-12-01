import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// ✅ Fetch all videos from Supabase Storage (used on Home screen)
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
    .map((file) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from("videos").getPublicUrl(file.name);

      return {
        $id: file.name,
        title: file.name, // fallback title
        creator: "Unknown",
        avatar: "https://placehold.co/100x100?text=User",
        thumbnail: `https://YOUR_PROJECT.supabase.co/storage/v1/object/public/thumbnails/${file.name.replace(
          ".mp4",
          ".jpg"
        )}`,
        video: encodeURI(publicUrl),
      };
    });
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

    console.log("Search query:", safeQuery);
    console.log("Rows returned:", rows);

    if (error) {
      console.error("Error searching videos:", error);
      setData([]);
    } else {
      const enriched = rows.map((row) => {
        const {
          data: { publicUrl },
        } = supabase.storage.from("videos").getPublicUrl(row.filename || "");

        return {
          $id: row.id || row.filename,
          title: row.title || row.filename,
          creator: row.creator || "Unknown",
          avatar: row.avatar || "https://placehold.co/100x100?text=User",
          thumbnail: `https://YOUR_PROJECT.supabase.co/storage/v1/object/public/thumbnails/${(row.filename || "").replace(
            ".mp4",
            ".jpg"
          )}`,
          video: encodeURI(publicUrl),
        };
      });

      setData(enriched);
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