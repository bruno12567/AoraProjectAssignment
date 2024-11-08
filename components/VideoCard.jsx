import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { View, Text, TouchableOpacity, Image, Alert, Modal } from "react-native";

import { icons } from "../constants";

const VideoCard = ({ title, creator, avatar, thumbnail, video, videoId, onDelete }) => { 
  const [play, setPlay] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Delete Video",
      "Are you sure you want to delete this video?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            onDelete(videoId); 
            setShowMenu(false); 
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View style={{ borderColor: '#FF0000' }}
          className="w-[46px] h-[46px] rounded-lg border  border-secondary flex justify-center items-center p-0.5">
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

        <TouchableOpacity onPress={() => setShowMenu(true)} className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", top: 0, right: 0, left: 0, bottom: 0 }}
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
            <TouchableOpacity onPress={handleDelete} style={{ paddingVertical: 8 }}>
              <Text style={{ color: "white", fontSize: 16 }}>Delete Video</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
