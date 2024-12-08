import { useState, useEffect } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, Alert, Modal } from "react-native";
import { icons } from "../constants";
import { addBookmark, removeBookmark, getAllBookmarks } from "../lib/appwrite"; // Importe as funções do Appwrite

const VideoCard = ({ title, creator, avatar, thumbnail, video, videoId, onDelete, userId }) => {
  const [play, setPlay] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Verificar se o vídeo já está nos favoritos ao carregar
  useEffect(() => {
    const checkIfBookmarked = async () => {
      const bookmarks = await getAllBookmarks(userId); // Função para obter todos os bookmarks
      const isAlreadyBookmarked = bookmarks.some((b) => b.videoId === videoId);
      setIsBookmarked(isAlreadyBookmarked);
    };

    checkIfBookmarked();
  }, [videoId, userId]);

  // Função para alternar o estado do bookmark
  const toggleBookmark = async () => {
    if (isBookmarked) {
      // Remover o bookmark
      const success = await removeBookmark(videoId); // Passe o ID do vídeo
      if (success) {
        setIsBookmarked(false);
        Alert.alert("Removed from Bookmarks", `The video "${title}" has been removed.`);
      }
    } else {
      // Adicionar o bookmark
      const success = await addBookmark(userId, videoId); // Use o userId e videoId
      if (success) {
        setIsBookmarked(true);
        Alert.alert("Added to Bookmarks", `The video "${title}" has been added.`);
      }
    }
  };

  // Função para deletar o vídeo
  const handleDelete = () => {
    Alert.alert(
      "Delete Video",
      "Are you sure you want to delete this video?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            onDelete(videoId); // Função passada para deletar o vídeo
            setShowMenu(false);
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      {/* Header */}
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View
            style={{ borderColor: "#FF0000" }}
            className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5"
          >
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text className="font-psemibold text-sm text-white" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
              {creator}
            </Text>
          </View>
        </View>

        <View className="flex flex-row items-center">
          {isBookmarked && (
            <Image
              source={icons.bookmark}
              className="w-5 h-5 mr-2"
              resizeMode="contain"
            />
          )}
          <TouchableOpacity onPress={() => setShowMenu(true)} className="pt-2">
            <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Menu */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
          onPress={() => setShowMenu(false)}
          activeOpacity={1}
        >
          <View
            style={{
              position: "absolute",
              top: 80,
              right: 20,
              backgroundColor: "#333",
              padding: 10,
              borderRadius: 8,
              width: 150,
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={toggleBookmark} style={{ paddingVertical: 8 }}>
              <Text style={{ color: "white", fontSize: 16 }}>
                {isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={{ paddingVertical: 8 }}>
              <Text style={{ color: "white", fontSize: 16 }}>Delete Video</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Video/Thumbnail */}
      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
