import { useState, useEffect } from "react";
import { SafeAreaView, FlatList, View, Text, RefreshControl } from "react-native";
import useAppwrite from "../../lib/useAppwrite";
import { getAllBookmarks, fetchVideoDataFromYourDatabase } from "../../lib/appwrite";
import { VideoCard } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Bookmarks = () => {
  const { user } = useGlobalContext(); 
  const { data: response, refetch } = useAppwrite(getAllBookmarks); 
  const [refreshing, setRefreshing] = useState(false);
  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    const fetchVideoData = async () => {
      const videos = await Promise.all(response.map(async (bookmark) => {
        const video = await getVideoDataByPostId(bookmark.postId);
        return { ...bookmark, ...video }; // Combine bookmark and video data
      }));
      setVideoData(videos);
    };

    if (response) {
      fetchVideoData();
    }
  }, [response]); // Run when response changes

  const getVideoDataByPostId = async (postId) => {
    try {
      const videoResponse = await fetchVideoDataFromYourDatabase(postId); // Call your newly defined function
      return videoResponse; // Ensure this returns the full video data object
    } catch (error) {
      console.error("Error fetching video data:", error);
      return {}; // Return an empty object or handle the error appropriately
    }
  };
  

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch(); // Refresh bookmark list
    setRefreshing(false);
  };

  return (
    
    <SafeAreaView className="flex my-6 px-4 space-y-8 bg-primary h-full">
      <Text className="text-2xl text-white font-psemibold flex my-8 px-4 space-y-4">Saved Videos</Text>
      <FlatList
        data={videoData} // Use combined video data
        keyExtractor={(item) => item.$id} // Use bookmark ID or a unique key
        renderItem={({ item }) => (
          <VideoCard
            title={item.title} // Ensure this matches your video attributes
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator?.username} // Ensure creator exists
            avatar={item.creator?.avatar} // Ensure avatar exists
            videoId={item.$id} // Pass the video ID
          />
        )}
        ListEmptyComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <Text className="flex justify-between items-start flex-row mb-6">
              No Bookmarked Videos Found
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmarks;
